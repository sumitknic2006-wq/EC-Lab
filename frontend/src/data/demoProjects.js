/**
 * EC LAB - Demonstration Project Data
 * These entries are strictly illustrative demonstration data for UI visualization.
 * They do not represent real student credentials, verified records, or private files.
 */

export const DEMO_PROJECTS = [
  {
    id: 'demo-1',
    slug: 'iot-environmental-node',
    title: 'IoT Smart Laboratory Environmental Node',
    category: 'IoT',
    secondaryCategory: 'Embedded Systems',
    description:
      'A low-power telemetry station leveraging ESP32 and LoRaWAN to monitor ambient temperature, humidity, and air quality metrics across academic electronics labs.',
    tags: ['ESP32', 'LoRaWAN', 'BME280', 'MQTT', 'Embedded C', 'FreeRTOS'],
    academicYear: '2025-2026',
    semester: 'Semester 7 (Final Year Capstone)',
    department: 'Electronics & Communication Engineering',
    laboratory: 'Advanced Embedded Systems & IoT Lab (Lab 402)',
    institution: 'EC LAB Smart Repository Demonstration',
    status: 'Illustrative Prototype',
    summary:
      'The IoT Smart Laboratory Environmental Node is a low-power, distributed sensing platform engineered to maintain continuous environmental compliance in sensitive electronics and communication test environments. Built around an ESP32 micro-controller and long-range LoRaWAN telemetry, the hardware station tracks ambient temperature, relative humidity, atmospheric pressure, and volatile gas presence without burdening institutional Wi-Fi infrastructure.',
    objective:
      'Design, calibrate, and deploy a self-sustaining wireless monitoring node tailored for laboratory equipment protection. The node transmits ambient telemetry packets over long-range RF, alerts lab coordinators to micro-climate deviations, and registers hardware authenticity via embedded cryptographic physical tags.',
    problemStatement:
      'High-precision testbenches (spectrum analyzers, PCB fabrication units, and optical test fixtures) are susceptible to micro-climate variations and undetected humidity spikes that cause calibration drift and oxidation. Existing monitoring solutions either rely on fragile wired harnesses or heavily congested 2.4 GHz Wi-Fi networks that fail during power outages or high RF interference. There is an immediate requirement for an autonomous, tamper-verifiable telemetry node with multi-day battery endurance.',
    workflowSteps: [
      {
        step: '01',
        title: 'Sensor Acquisition & Calibration',
        desc: 'Precision environmental transducers (BME280 sensor suite) periodically sample temperature, relative humidity, and atmospheric pressure over an I2C bus at calibrated 60-second intervals.'
      },
      {
        step: '02',
        title: 'On-Node Processing & Packaging',
        desc: 'The dual-core ESP32 executes moving-average digital filtering under FreeRTOS, checks values against safety baselines, and compresses measurements into a compact 16-byte binary payload.'
      },
      {
        step: '03',
        title: 'LoRaWAN Long-Range Uplink',
        desc: 'An integrated RFM95W transceiver module broadcasts encrypted packets via LoRaWAN (868 MHz ISM band) to the departmental gateway with zero dependence on local Wi-Fi.'
      },
      {
        step: '04',
        title: 'Gateway Ingestion & Tag Sync',
        desc: 'The gateway validates node cryptographic signatures, ingests telemetry into the laboratory log, and synchronizes status with the physical QR/NFC prototype tag.'
      }
    ],
    videoPlaceholder: {
      title: 'Laboratory Prototype Hardware & Telemetry Demonstration',
      duration: '03:45',
      note: 'Demonstration video placeholder — physical hardware demonstration recording and sensor testbench validation will be linked following faculty evaluation review.',
      aspectRatio: '16:9'
    },
    teamMembers: [
      {
        name: 'Alex Rivera (Demo Student)',
        role: 'Firmware & Sensor Interfacing',
        badge: 'Lead Developer'
      },
      {
        name: 'Priya Sharma (Demo Student)',
        role: 'LoRaWAN Protocol & RF Design',
        badge: 'Hardware Engineer'
      },
      {
        name: 'Jordan Lee (Demo Student)',
        role: 'Power Management & Enclosure CAD',
        badge: 'System Integration'
      }
    ],
    facultyGuide: {
      name: 'Dr. Evelyn Vance (Demo Faculty Guide)',
      designation: 'Associate Professor, Department of ECE',
      department: 'Electronics & Communication Engineering',
      laboratory: 'Embedded Systems & Sensor Networks Research Group'
    },
    verificationDetails: {
      tagType: 'Dual QR Code & NFC NTAG213 Module',
      simulatedUid: 'ECLAB:DEMO:NODE-01:8492',
      verificationMethod: 'Planned Protocol: Cryptographic HMAC Token with URL Signature',
      authenticityStatus: 'Demonstration Profile (Simulated Physical Tag Link)',
      labLocation: 'ECE Department - Block B, Electronics Lab 402, Workbench 07'
    },
    accessPolicyNotice: {
      publicAvailability: 'Overview, abstract, public workflow diagram, demonstration placeholder, and verification metadata.',
      restrictedAssets: [
        'Complete KiCad / Altium schematic files & PCB Gerber fabrication archives',
        'ESP32 firmware source code repositories and proprietary LoRaWAN network keys',
        'Confidential semester evaluation rubrics, defense committee notes, and full academic theses'
      ],
      howToRequest: 'Authorized faculty members, project mentors, and institutional evaluators may submit an authenticated Access Request through the EC LAB governance portal.'
    }
  },
  {
    id: 'demo-2',
    slug: 'campus-event-portal',
    title: 'Campus Event Management Portal',
    category: 'Web Development',
    secondaryCategory: 'Cloud Computing',
    description:
      'A full-stack institutional web portal for scheduling laboratory symposiums, managing attendee registrations, and publishing digital participation credentials.',
    tags: ['React', 'Node.js', 'REST API', 'Tailwind', 'Express'],
    academicYear: '2025-2026',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'demo-3',
    slug: 'smart-energy-predictor',
    title: 'Smart Energy Usage Predictor',
    category: 'AI/ML',
    secondaryCategory: 'Data Science',
    description:
      'A machine learning predictive model utilizing multivariate time-series forecasting to optimize departmental power consumption and laboratory load distribution.',
    tags: ['Python', 'Scikit-Learn', 'Time Series', 'Flask', 'Pandas'],
    academicYear: '2024-2025',
    department: 'Electrical & Electronics Engineering',
  }
];

export function getProjectBySlug(slug) {
  if (!slug) return null;
  return DEMO_PROJECTS.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  ) || null;
}
