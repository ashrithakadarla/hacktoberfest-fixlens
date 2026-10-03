export interface DemoPreset {
  id: string;
  title: string;
  badge: string;
  category: 'electronics' | 'software' | 'physical_object';
  description: string;
  imageFileName: string;
  dataUrl: string;
}

// Crisp inline SVG data URLs for high-impact demo preset loading
const ARDUINO_LED_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none">
  <rect width="800" height="500" fill="%230F172A"/>
  <!-- Grid pattern -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%231E293B" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(%23grid)"/>
  
  <!-- Breadboard -->
  <rect x="150" y="80" width="500" height="340" rx="12" fill="%23F8FAFC" stroke="%23CBD5E1" stroke-width="4"/>
  <rect x="170" y="100" width="460" height="300" rx="6" fill="%23E2E8F0"/>
  <!-- Breadboard tie lines -->
  <line x1="180" y1="250" x2="620" y2="250" stroke="%2394A3B8" stroke-width="6" stroke-dasharray="10 10"/>
  <line x1="180" y1="120" x2="620" y2="120" stroke="%23EF4444" stroke-width="4"/>
  <line x1="180" y1="140" x2="620" y2="140" stroke="%233B82F6" stroke-width="4"/>
  <line x1="180" y1="360" x2="620" y2="360" stroke="%23EF4444" stroke-width="4"/>
  <line x1="180" y1="380" x2="620" y2="380" stroke="%233B82F6" stroke-width="4"/>

  <!-- Arduino Board -->
  <rect x="50" y="140" width="160" height="240" rx="8" fill="%230284C7"/>
  <rect x="70" y="160" width="40" height="50" fill="%2364748B"/>
  <text x="130" y="260" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" transform="rotate(-90 130 260)">ARDUINO UNO</text>

  <!-- Jumper Wires -->
  <path d="M 190 200 C 230 150, 310 150, 350 200" stroke="%23EF4444" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 190 280 C 250 340, 360 340, 420 280" stroke="%2310B981" stroke-width="5" fill="none" stroke-linecap="round"/>
  
  <!-- Resistor -->
  <rect x="350" y="195" width="70" height="12" rx="4" fill="%23FDE047" stroke="%23CA8A04" stroke-width="2"/>
  <line x1="370" y1="195" x2="370" y2="207" stroke="%23B45309" stroke-width="3"/>
  <line x1="390" y1="195" x2="390" y2="207" stroke="%23DC2626" stroke-width="3"/>

  <!-- LED Component (Reversed polarity indication) -->
  <path d="M 420 280 L 420 260 Q 420 240 435 240 Q 450 240 450 260 L 450 280 Z" fill="%23EF4444" opacity="0.85" stroke="%23B91C1C" stroke-width="2"/>
  <line x1="428" y1="280" x2="428" y2="305" stroke="%2394A3B8" stroke-width="3"/>
  <line x1="442" y1="280" x2="442" y2="298" stroke="%2394A3B8" stroke-width="3"/>
  <text x="410" y="225" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23F87171">LED (Flat cathode to +5V)</text>

  <!-- Warning annotation circle -->
  <circle cx="435" cy="270" r="35" stroke="%23F59E0B" stroke-width="3" stroke-dasharray="6 4" fill="none"/>
  <text x="480" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FBBF24">⚠ Wiring Polarity Issue</text>
</svg>`;

const PYTHON_ERROR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none">
  <!-- IDE Window background -->
  <rect width="800" height="500" fill="%231E1E1E" rx="12"/>
  
  <!-- Window titlebar -->
  <path d="M 0 0 L 800 0 L 800 40 L 0 40 Z" fill="%232D2D2D"/>
  <circle cx="20" cy="20" r="6" fill="%23FF5F56"/>
  <circle cx="40" cy="20" r="6" fill="%23FFBD2E"/>
  <circle cx="60" cy="20" r="6" fill="%2327C93F"/>
  <text x="340" y="25" font-family="monospace" font-size="14" fill="%23CCCCCC">main.py - VSCode Terminal</text>

  <!-- Code Area -->
  <text x="40" y="80" font-family="monospace" font-size="16" fill="%23C586C0">import <tspan fill="%239CDCFE">sys</tspan></text>
  <text x="40" y="110" font-family="monospace" font-size="16" fill="%23C586C0">import <tspan fill="%23F44747">pandas</tspan> as <tspan fill="%239CDCFE">pd</tspan></text>
  <text x="40" y="140" font-family="monospace" font-size="16" fill="%236A9955"># Load dataset</text>
  <text x="40" y="170" font-family="monospace" font-size="16" fill="%23DCDCAA">df = pd.read_csv('data.csv')</text>
  
  <!-- Terminal Area -->
  <rect x="20" y="220" width="760" height="260" rx="8" fill="%23141414" stroke="%23333333" stroke-width="2"/>
  <text x="40" y="250" font-family="monospace" font-size="14" fill="%234EC9B0">$ python main.py</text>
  
  <text x="40" y="285" font-family="monospace" font-size="14" fill="%23F87171">Traceback (most recent call last):</text>
  <text x="60" y="315" font-family="monospace" font-size="14" fill="%23CCCCCC">File "main.py", line 2, in &lt;module&gt;</text>
  <text x="80" y="345" font-family="monospace" font-size="14" fill="%23CE9178">import pandas as pd</text>
  <text x="40" y="390" font-family="monospace" font-size="18" font-weight="bold" fill="%23F87171">ModuleNotFoundError: No module named 'pandas'</text>

  <!-- Error box highlighting -->
  <rect x="30" y="365" width="550" height="40" rx="6" fill="%237F1D1D" fill-opacity="0.3" stroke="%23EF4444" stroke-width="2"/>
</svg>`;

const PHYSICAL_ASSEMBLY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none">
  <rect width="800" height="500" fill="%230F172A"/>
  <!-- Metal Bracket -->
  <rect x="150" y="200" width="300" height="180" rx="8" fill="%2364748B" stroke="%23475569" stroke-width="4"/>
  <rect x="400" y="120" width="250" height="260" rx="8" fill="%23475569" stroke="%23334155" stroke-width="4"/>
  
  <!-- Joint seam with gap -->
  <line x1="400" y1="200" x2="400" y2="380" stroke="%23F59E0B" stroke-width="6" stroke-dasharray="8 6"/>
  <text x="360" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FBBF24">⚠ Seam Gap (Misaligned)</text>

  <!-- Bolt sticking out angled -->
  <g transform="rotate(12 420 250)">
    <rect x="380" y="240" width="80" height="24" rx="4" fill="%2394A3B8" stroke="%231E293B" stroke-width="2"/>
    <polygon points="380,240 370,252 380,264" fill="%23CBD5E1"/>
  </g>
  <text x="480" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23F87171">Cross-threaded Bolt</text>
</svg>`;

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'electronics_led',
    title: 'Incorrect Arduino LED Circuit',
    badge: 'Flagship Demo',
    category: 'electronics',
    description: "The LED isn't turning on despite uploading the blink sketch.",
    imageFileName: 'arduino_led_issue.png',
    dataUrl: ARDUINO_LED_SVG,
  },
  {
    id: 'software_pandas',
    title: 'Python Pandas Import Error',
    badge: 'Software Scan',
    category: 'software',
    description: "Script fails with ModuleNotFoundError when running python main.py",
    imageFileName: 'python_error_screenshot.png',
    dataUrl: PYTHON_ERROR_SVG,
  },
  {
    id: 'physical_bolt',
    title: 'Misaligned Bolt Joint',
    badge: 'Physical Object',
    category: 'physical_object',
    description: "The assembly bracket fastener won't tighten flush against the surface.",
    imageFileName: 'bracket_assembly_gap.png',
    dataUrl: PHYSICAL_ASSEMBLY_SVG,
  },
];

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
