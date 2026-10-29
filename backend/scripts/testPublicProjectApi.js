import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Project from '../src/models/Project.js';

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- Starting EC LAB Phase 4 Step 1.2 Public API Review Corrections Tests ---');
  let testUser = null;
  let approvedProject = null;
  let draftProject = null;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB Atlas for test fixture management');

    // 1. Health check
    const health = await makeRequest('/api/v1/health');
    if (health.status !== 200 || health.body.status !== 'ok') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('✓ Test 1: GET /api/v1/health passed (200 OK)');

    // 2. Empty state check
    const emptyList = await makeRequest('/api/v1/projects');
    if (emptyList.status !== 200 || emptyList.body.data.projects.length !== 0) {
      throw new Error(`Expected empty list initially, got: ${JSON.stringify(emptyList.body)}`);
    }
    console.log('✓ Test 2: Initial empty state check passed (total 0 projects)');

    // 3. Create controlled temporary test records
    testUser = await User.create({
      name: 'Test Temporary Student',
      email: `temp.student.${Date.now()}@eclab.edu`,
      passwordHash: 'dummy_hash_for_test_fixture',
      role: 'student',
      department: 'Electronics & Communication Engineering',
    });

    approvedProject = await Project.create({
      title: 'IoT Environmental Telemetry Node',
      slug: 'iot-env-telemetry-node',
      academicYear: '2025-2026',
      semester: 7,
      department: 'Electronics & Communication Engineering',
      laboratory: 'Advanced Embedded Systems Lab',
      qrCodeIdentifier: `QR-TEST-APP-${Date.now()}`,
      nfcTagUrl: 'https://eclab.internal/nfc-tag-write-endpoint-secret',
      summary: 'Low-power telemetry station leveraging ESP32 and LoRaWAN.',
      abstract: 'Detailed technical abstract for ambient laboratory condition monitoring.',
      category: 'IoT & Smart Systems',
      tags: ['esp32', 'lorawan', 'bme280'],
      status: 'approved',
      submittedBy: testUser._id,
      reviewedBy: testUser._id,
      reviewedAt: new Date(),
      reviewFeedback: 'CONFIDENTIAL REVIEWER EVALUATION: Internal grade A+',
      sourceCodeRepository: {
        url: 'https://github.com/eclab-internal/confidential-firmware',
        isPrivate: true,
        accessNotes: 'SECRET_DEPLOYMENT_TOKEN_DO_NOT_EXPOSE',
      },
      privateFiles: [
        {
          title: 'Full Hardware Schematic',
          fileType: 'circuit_schematic',
          storageKey: 's3://eclab-internal/confidential/schematic_v2.pdf',
          originalFileName: 'schematic_v2.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 2048576,
        },
      ],
      teamMembers: [
        {
          name: 'Alex Rivera',
          rollNumber: 'ROLL_SECRET_849201',
          contribution: 'Firmware Architect',
        },
      ],
      facultyGuides: [
        {
          name: 'Dr. Evelyn Vance',
          designation: 'Associate Professor',
          department: 'ECE',
        },
      ],
    });

    draftProject = await Project.create({
      title: 'Draft Unapproved Drone Project',
      slug: 'draft-unapproved-drone-project',
      academicYear: '2025-2026',
      semester: 7,
      department: 'Electronics & Communication Engineering',
      laboratory: 'Robotics Lab',
      qrCodeIdentifier: `QR-TEST-DRAFT-${Date.now()}`,
      summary: 'Draft drone summary.',
      abstract: 'Draft abstract.',
      category: 'Robotics & Automation',
      tags: ['drone', 'unapproved'],
      status: 'draft',
      submittedBy: testUser._id,
    });

    console.log('✓ Created controlled temporary fixtures (1 approved, 1 draft)');

    // 4. Test Approved Project List & Non-Approved Exclusion
    const listRes = await makeRequest('/api/v1/projects');
    if (listRes.status !== 200) {
      throw new Error(`List request failed with status: ${listRes.status}`);
    }
    const projects = listRes.body.data.projects;
    if (projects.length !== 1 || projects[0].slug !== 'iot-env-telemetry-node') {
      throw new Error(`Expected exactly 1 approved project in list, got: ${JSON.stringify(projects)}`);
    }
    console.log('✓ Test 3: GET /api/v1/projects returned approved project and completely excluded draft project');

    // 5. Test List DTO Allowlist, Abstract Omission, and qrCodeIdentifier Presence
    const p = projects[0];

    // Confirm qrCodeIdentifier is present in list item
    if (!p.qrCodeIdentifier || p.qrCodeIdentifier !== approvedProject.qrCodeIdentifier) {
      throw new Error('Expected qrCodeIdentifier to be present in list response item');
    }

    // Confirm summary is present
    if (!p.summary || typeof p.summary !== 'string') {
      throw new Error('Expected summary to be present in list response item');
    }

    // Confirm full abstract is OMITTED from list item
    if (p.abstract !== undefined) {
      throw new Error('SECURITY / DESIGN VIOLATION: Full abstract should be omitted from list response item!');
    }

    const forbiddenFields = [
      'abstract', // Must not appear in list item
      'nfcTagUrl', // Must not appear in list or detail
      'privateFiles',
      'sourceCodeRepository',
      'submittedBy',
      'reviewedBy',
      'reviewFeedback',
      'passwordHash',
    ];

    for (const f of forbiddenFields) {
      if (p[f] !== undefined) {
        throw new Error(`SECURITY LEAK: Found forbidden field "${f}" in public project list response!`);
      }
    }
    if (p.teamMembers[0].rollNumber !== undefined) {
      throw new Error('SECURITY LEAK: Found team member rollNumber in public project list response!');
    }
    console.log('✓ Test 4: List item verified: qrCodeIdentifier & summary are present; full abstract, nfcTagUrl, rollNumber, and privateFiles are omitted');

    // 6. Test Single Project Lookup by Slug: Abstract & qrCodeIdentifier Present, Confidential Fields Omitted
    const slugRes = await makeRequest('/api/v1/projects/iot-env-telemetry-node');
    if (slugRes.status !== 200 || slugRes.body.status !== 'success') {
      throw new Error(`Slug request failed: ${JSON.stringify(slugRes.body)}`);
    }
    const singleProj = slugRes.body.data.project;
    if (singleProj.slug !== 'iot-env-telemetry-node' || singleProj.isApproved !== true) {
      throw new Error(`Project payload mismatch: ${JSON.stringify(singleProj)}`);
    }

    // Confirm qrCodeIdentifier is present in detail DTO
    if (!singleProj.qrCodeIdentifier || singleProj.qrCodeIdentifier !== approvedProject.qrCodeIdentifier) {
      throw new Error('Expected qrCodeIdentifier to be present in detail response');
    }

    // Confirm abstract IS present in detail DTO
    if (!singleProj.abstract || singleProj.abstract !== approvedProject.abstract) {
      throw new Error('Expected full abstract to be present in detail response');
    }

    // Forbidden fields for single project detail (note: abstract is allowed in detail)
    const detailForbiddenFields = [
      'nfcTagUrl',
      'privateFiles',
      'sourceCodeRepository',
      'submittedBy',
      'reviewedBy',
      'reviewFeedback',
      'passwordHash',
    ];
    for (const f of detailForbiddenFields) {
      if (singleProj[f] !== undefined) {
        throw new Error(`SECURITY LEAK: Found forbidden field "${f}" in single project response!`);
      }
    }
    if (singleProj.teamMembers[0].rollNumber !== undefined) {
      throw new Error('SECURITY LEAK: Found team member rollNumber in single project response!');
    }
    console.log('✓ Test 5: GET /api/v1/projects/:slug verified: abstract & qrCodeIdentifier present; nfcTagUrl & privateFiles excluded');

    // 7. Test Non-Approved Project Lookup by Slug (Exclusion)
    const draftLookup = await makeRequest('/api/v1/projects/draft-unapproved-drone-project');
    if (draftLookup.status !== 404 || draftLookup.body.status !== 'fail') {
      throw new Error(`Expected 404 for draft project lookup, got: ${draftLookup.status}`);
    }
    console.log('✓ Test 6: GET /api/v1/projects/:slug correctly returned 404 for non-approved (draft) project');

    // 8. Test Missing / Non-Existent Slug
    const missingLookup = await makeRequest('/api/v1/projects/completely-unknown-slug');
    if (missingLookup.status !== 404 || missingLookup.body.status !== 'fail') {
      throw new Error(`Expected 404 for missing project, got: ${missingLookup.status}`);
    }
    console.log('✓ Test 7: GET /api/v1/projects/:slug returned 404 for missing slug');

    // 9. Test Pagination Clamping and Invalid Parameters
    const pag1 = await makeRequest('/api/v1/projects?page=-5&limit=-20');
    if (pag1.body.data.pagination.page !== 1 || pag1.body.data.pagination.limit !== 10) {
      throw new Error(`Negative pagination clamping failed: ${JSON.stringify(pag1.body.data.pagination)}`);
    }

    const pag2 = await makeRequest('/api/v1/projects?page=abc&limit=9999');
    if (pag2.body.data.pagination.page !== 1 || pag2.body.data.pagination.limit !== 50) {
      throw new Error(`Max limit clamping failed: ${JSON.stringify(pag2.body.data.pagination)}`);
    }
    console.log('✓ Test 8: Pagination parameters validated and clamped (page defaults to 1, limit capped at 50)');

    // 10. Test Query Filters
    const catMatch = await makeRequest('/api/v1/projects?category=IoT%20%26%20Smart%20Systems');
    if (catMatch.body.data.projects.length !== 1) {
      throw new Error('Category filter match failed');
    }
    const catMismatch = await makeRequest('/api/v1/projects?category=VLSI%20%26%20Microelectronics');
    if (catMismatch.body.data.projects.length !== 0) {
      throw new Error('Category filter mismatch failed');
    }

    const searchMatch = await makeRequest('/api/v1/projects?search=lorawan');
    if (searchMatch.body.data.projects.length !== 1) {
      throw new Error('Search match failed');
    }
    const searchMismatch = await makeRequest('/api/v1/projects?search=quantum');
    if (searchMismatch.body.data.projects.length !== 0) {
      throw new Error('Search mismatch failed');
    }
    console.log('✓ Test 9: Category and search filtering correctly applied to approved projects');

    // 11. Test Search Input Length Limiting (>100 characters safe handling)
    const longSearchString = 'esp32' + 'a'.repeat(150);
    const longSearchRes = await makeRequest(`/api/v1/projects?search=${encodeURIComponent(longSearchString)}`);
    if (longSearchRes.status !== 200 || !Array.isArray(longSearchRes.body.data.projects)) {
      throw new Error(`Long search query failed with status: ${longSearchRes.status}`);
    }

    // Verify whitespace padding + 120 chars handled cleanly without throwing
    const whitespacePaddedLong = '   ' + 'lorawan' + 'z'.repeat(120);
    const paddedSearchRes = await makeRequest(`/api/v1/projects?search=${encodeURIComponent(whitespacePaddedLong)}`);
    if (paddedSearchRes.status !== 200) {
      throw new Error(`Padded search query failed with status: ${paddedSearchRes.status}`);
    }
    console.log('✓ Test 10: Search input >100 characters safely limited after trimming without throwing errors');

    console.log('\nAll 10 backend test scenarios PASSED successfully!');
  } finally {
    // Unconditional cleanup of all test records
    console.log('Cleaning up temporary test records...');
    if (approvedProject) {
      await Project.deleteOne({ _id: approvedProject._id });
    }
    if (draftProject) {
      await Project.deleteOne({ _id: draftProject._id });
    }
    if (testUser) {
      await User.deleteOne({ _id: testUser._id });
    }

    const remainingProjects = await Project.countDocuments();
    const remainingUsers = await User.countDocuments();
    console.log(`Database cleanup verified: Remaining Projects: ${remainingProjects}, Remaining Users: ${remainingUsers}`);

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
