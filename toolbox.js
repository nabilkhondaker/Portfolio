/**
 * engineering toolbox for Nabil's portfolio[cite: 1]
 * features 11 calculators/tools covering dynamics, FEA, kinematics, and solid mechanics.[cite: 1]
 */

document.addEventListener("DOMContentLoaded", () => {
    initToolbox();
});

const toolsData = [
    { id: "beam", title: "beam calculator", icon: "fa-solid fa-ruler-horizontal", desc: "computes max deflection and bending moment for simple beams" },
    { id: "stress", title: "stress/strain & Hooke's", icon: "fa-solid fa-compress", desc: "material behavior, true vs engineering stress, and elastic moduli" },
    { id: "mohr", title: "Mohr's circle", icon: "fa-solid fa-circle-notch", desc: "planar stress transformation, principal stresses, and max shear" },
    { id: "matrix", title: "matrix operations", icon: "fa-solid fa-table-cells", desc: "determinate, inverse, and multiplication for 2x2 / 3x3 matrices" },
    { id: "units", title: "unit conversion", icon: "fa-solid fa-scale-balanced", desc: "engineering specific conversions (lbf/N, psi/MPa, hp/kW)" },
    { id: "kinematics", title: "2R planar kinematics", icon: "fa-solid fa-robot", desc: "inverse kinematics for a 2D robotic arm to reach target coordinates" },
    { id: "pid", title: "PID tuning (ZN)", icon: "fa-solid fa-sliders", desc: "Ziegler-Nichols heuristic tuner based on ultimate gain and period" },
    { id: "vibration", title: "vibration modes", icon: "fa-solid fa-wave-square", desc: "1DOF mass-spring-damper natural frequencies and damping ratios" },
    { id: "reynolds", title: "Reynolds number", icon: "fa-solid fa-water", desc: "fluid flow regimes based on density, velocity, length, and viscosity" },
    { id: "fea", title: "FEA preprocessor", icon: "fa-solid fa-vector-square", desc: "1D bar element local stiffness matrix generator" },
    { id: "topology", title: "SIMP topology opt", icon: "fa-solid fa-bezier-curve", desc: "explore volume fraction and penalization impacts on density" }
];

function initToolbox() {
    const mainGrid = document.getElementById("toolbox-main-grid");
    const subViews = document.getElementById("toolbox-subviews");
    const introCard = document.getElementById("toolbox-intro");
    const sidebarToolboxBtn = document.querySelector('.vs-sidebar-item[data-page="toolbox"]');
    
    // Ensure Sidebar click binds to the custom toolbox page logic 
    // (fallback if script.js setupSidebarAndRightPages misses it)
    if (sidebarToolboxBtn) {
        sidebarToolboxBtn.addEventListener("click", () => {
            document.getElementById("page-toolbox").classList.add("open");
            document.getElementById("vs-sidebar").classList.remove("open");
            document.getElementById("vs-sidebar-backdrop").classList.remove("open");
        });
    }

    // Build the Main Grid
    toolsData.forEach(tool => {
        // Grid Card
        const card = document.createElement("div");
        card.className = "tool-card-ui card";
        card.innerHTML = `
            <div class="card-content">
                <div class="tool-icon"><i class="${tool.icon}"></i></div>
                <h4>${tool.title}</h4>
                <p class="tool-desc">${tool.desc}</p>
            </div>
        `;
        card.addEventListener("click", () => openTool(tool.id));
        mainGrid.appendChild(card);

        // Sub View Container
        const subView = document.createElement("div");
        subView.className = "toolbox-tool-view";
        subView.id = `tool-view-${tool.id}`;
        
        subView.innerHTML = `
            <div class="tool-header-row">
                <button class="tool-back-btn" onclick="closeTool()"><i class="fa-solid fa-arrow-left"></i></button>
                <h4 class="tool-view-title">${tool.title}</h4>
            </div>
            <div class="tool-calc-content card">
                <div class="card-content" id="calc-content-${tool.id}">
                    <!-- Injected by JS -->
                </div>
            </div>
        `;
        subViews.appendChild(subView);
    });

    // Initialize individual calculators
    initBeamCalc();
    initStressCalc();
    initMohrCalc();
    initMatrixCalc();
    initUnitCalc();
    initKinematicsCalc();
    initPIDCalc();
    initVibrationCalc();
    initReynoldsCalc();
    initFEACalc();
    initTopologyCalc();
}

function openTool(id) {
    document.getElementById("toolbox-main-grid").classList.remove("active-view");
    document.getElementById("toolbox-main-grid").classList.add("hidden-view");
    document.getElementById("toolbox-intro").style.display = "none";
    
    const views = document.querySelectorAll(".toolbox-tool-view");
    views.forEach(v => v.classList.remove("active-tool"));
    
    const target = document.getElementById(`tool-view-${id}`);
    if (target) {
        target.classList.add("active-tool");
    }
}

function closeTool() {
    const views = document.querySelectorAll(".toolbox-tool-view");
    views.forEach(v => v.classList.remove("active-tool"));
    
    document.getElementById("toolbox-main-grid").classList.add("active-view");
    document.getElementById("toolbox-main-grid").classList.remove("hidden-view");
    document.getElementById("toolbox-intro").style.display = "block";
}

// ----------------------------------------------------
// 1. BEAM CALCULATOR (Cantilever / Simply Supported)
// ----------------------------------------------------
function initBeamCalc() {
    const container = document.getElementById("calc-content-beam");
    container.innerHTML = `
        <div class="calc-grid">
            <div class="input-group">
                <label>beam type</label>
                <select id="beam-type" class="form-input">
                    <option value="cantilever">cantilever</option>
                    <option value="simple">simply supported</option>
                </select>
            </div>
            <div class="input-group">
                <label>point load P (N)</label>
                <input type="number" id="beam-p" value="1000" class="form-input">
            </div>
            <div class="input-group">
                <label>length L (m)</label>
                <input type="number" id="beam-l" value="2" class="form-input">
            </div>
            <div class="input-group">
                <label>elastic modulus E (GPa)</label>
                <input type="number" id="beam-e" value="200" class="form-input">
            </div>
            <div class="input-group">
                <label>moment of inertia I (cm⁴)</label>
                <input type="number" id="beam-i" value="150" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>max deflection (δ):</strong> <span id="beam-def" class="text-gradient font-bold">0</span> mm</p>
            <p><strong>max bending moment (M):</strong> <span id="beam-mom" class="text-gradient font-bold">0</span> N·m</p>
        </div>
    `;

    const calculate = () => {
        const type = document.getElementById("beam-type").value;
        const P = parseFloat(document.getElementById("beam-p").value);
        const L = parseFloat(document.getElementById("beam-l").value);
        const E = parseFloat(document.getElementById("beam-e").value) * 1e9; // Pa
        const I = parseFloat(document.getElementById("beam-i").value) * 1e-8; // m^4

        if (!P || !L || !E || !I) return;

        let def, mom;
        if (type === "cantilever") {
            def = (P * Math.pow(L, 3)) / (3 * E * I);
            mom = P * L;
        } else {
            def = (P * Math.pow(L, 3)) / (48 * E * I);
            mom = (P * L) / 4;
        }

        document.getElementById("beam-def").innerText = (def * 1000).toFixed(4);
        document.getElementById("beam-mom").innerText = mom.toFixed(2);
    };

    container.querySelectorAll("input, select").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 2. STRESS / STRAIN
// ----------------------------------------------------
function initStressCalc() {
    const container = document.getElementById("calc-content-stress");
    container.innerHTML = `
        <div class="calc-grid">
            <div class="input-group">
                <label>engineering strain (ε)</label>
                <input type="number" id="ss-strain" value="0.05" step="0.01" class="form-input">
            </div>
            <div class="input-group">
                <label>engineering stress (MPa)</label>
                <input type="number" id="ss-stress" value="250" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>true strain:</strong> <span id="ss-t-strain" class="text-gradient font-bold">0</span></p>
            <p><strong>true stress:</strong> <span id="ss-t-stress" class="text-gradient font-bold">0</span> MPa</p>
        </div>
    `;
    const calculate = () => {
        const eStrain = parseFloat(document.getElementById("ss-strain").value);
        const eStress = parseFloat(document.getElementById("ss-stress").value);
        
        if(isNaN(eStrain) || isNaN(eStress)) return;
        
        const trueStrain = Math.log(1 + eStrain);
        const trueStress = eStress * (1 + eStrain);
        
        document.getElementById("ss-t-strain").innerText = trueStrain.toFixed(4);
        document.getElementById("ss-t-stress").innerText = trueStress.toFixed(2);
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 3. MOHR'S CIRCLE
// ----------------------------------------------------
function initMohrCalc() {
    const container = document.getElementById("calc-content-mohr");
    container.innerHTML = `
        <div class="calc-grid">
            <div class="input-group">
                <label>σ_x (MPa)</label>
                <input type="number" id="mc-sx" value="50" class="form-input">
            </div>
            <div class="input-group">
                <label>σ_y (MPa)</label>
                <input type="number" id="mc-sy" value="-10" class="form-input">
            </div>
            <div class="input-group">
                <label>τ_xy (MPa)</label>
                <input type="number" id="mc-txy" value="40" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded flex-col" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <div>
                <p><strong>principal stress σ₁:</strong> <span id="mc-s1" class="text-gradient font-bold">0</span> MPa</p>
                <p><strong>principal stress σ₂:</strong> <span id="mc-s2" class="text-gradient font-bold">0</span> MPa</p>
                <p><strong>max shear τ_max:</strong> <span id="mc-tmax" class="text-gradient font-bold">0</span> MPa</p>
            </div>
            <canvas id="mohr-canvas" width="300" height="150" style="width:100%; max-width:300px; margin-top:15px; border-radius: 8px; background: #0a0a0b; border: 1px solid #333;"></canvas>
        </div>
    `;

    const drawMohr = (sx, sy, txy, center, R) => {
        const canvas = document.getElementById("mohr-canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 20;
        const width = canvas.width;
        const height = canvas.height;
        
        const minSigma = center - R;
        const maxSigma = center + R;
        const span = Math.max(Math.abs(maxSigma - minSigma), R*2.5) || 100;
        const scale = (width - padding * 2) / span;

        const xToPixel = (val) => padding + (val - (center - span/2)) * scale;
        const yToPixel = (val) => height/2 - val * scale;

        // Axes
        ctx.strokeStyle = '#555';
        ctx.beginPath();
        ctx.moveTo(0, height/2); ctx.lineTo(width, height/2);
        ctx.moveTo(xToPixel(0), 0); ctx.lineTo(xToPixel(0), height);
        ctx.stroke();

        // Circle
        ctx.beginPath();
        ctx.arc(xToPixel(center), yToPixel(0), R * scale, 0, 2 * Math.PI);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#913700';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Points
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(xToPixel(sx), yToPixel(txy), 4, 0, 2*Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(xToPixel(sy), yToPixel(-txy), 4, 0, 2*Math.PI); ctx.fill();
        
        // Line between points
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xToPixel(sx), yToPixel(txy));
        ctx.lineTo(xToPixel(sy), yToPixel(-txy));
        ctx.stroke();
    };

    const calculate = () => {
        const sx = parseFloat(document.getElementById("mc-sx").value);
        const sy = parseFloat(document.getElementById("mc-sy").value);
        const txy = parseFloat(document.getElementById("mc-txy").value);

        if(isNaN(sx) || isNaN(sy) || isNaN(txy)) return;

        const C = (sx + sy) / 2;
        const R = Math.sqrt(Math.pow((sx - sy)/2, 2) + Math.pow(txy, 2));

        const s1 = C + R;
        const s2 = C - R;

        document.getElementById("mc-s1").innerText = s1.toFixed(2);
        document.getElementById("mc-s2").innerText = s2.toFixed(2);
        document.getElementById("mc-tmax").innerText = R.toFixed(2);
        
        drawMohr(sx, sy, txy, C, R);
    };

    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 4. MATRIX OPERATIONS (2x2)
// ----------------------------------------------------
function initMatrixCalc() {
    const container = document.getElementById("calc-content-matrix");
    container.innerHTML = `
        <p class="mb-2 text-sm text-secondary">2x2 matrix determinant & inverse</p>
        <div style="display:grid; grid-template-columns: 80px 80px; gap: 10px; justify-content: center; margin-bottom: 20px;">
            <input type="number" id="mat-a" value="2" class="form-input text-center">
            <input type="number" id="mat-b" value="1" class="form-input text-center">
            <input type="number" id="mat-c" value="5" class="form-input text-center">
            <input type="number" id="mat-d" value="3" class="form-input text-center">
        </div>
        <div class="calc-results p-3 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>determinant:</strong> <span id="mat-det" class="text-gradient font-bold">0</span></p>
            <p class="mt-2"><strong>inverse:</strong></p>
            <div id="mat-inv-res" class="mt-1 font-mono text-sm" style="color: #b3b3b3;"></div>
        </div>
    `;
    const calculate = () => {
        const a = parseFloat(document.getElementById("mat-a").value);
        const b = parseFloat(document.getElementById("mat-b").value);
        const c = parseFloat(document.getElementById("mat-c").value);
        const d = parseFloat(document.getElementById("mat-d").value);
        
        const det = (a*d) - (b*c);
        document.getElementById("mat-det").innerText = isNaN(det) ? "-" : det.toFixed(4);
        
        const invRes = document.getElementById("mat-inv-res");
        if (det === 0) {
            invRes.innerText = "matrix is singular (no inverse)";
        } else if (!isNaN(det)) {
            const iA = (d/det).toFixed(3), iB = (-b/det).toFixed(3);
            const iC = (-c/det).toFixed(3), iD = (a/det).toFixed(3);
            invRes.innerHTML = `[ ${iA}, ${iB} ]<br>[ ${iC}, ${iD} ]`;
        }
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 5. UNIT CONVERSION
// ----------------------------------------------------
function initUnitCalc() {
    const container = document.getElementById("calc-content-units");
    container.innerHTML = `
        <div class="calc-grid align-center">
            <input type="number" id="uc-val" value="1" class="form-input">
            <select id="uc-from" class="form-input">
                <option value="lbf">lbf</option>
                <option value="N">newtons</option>
                <option value="psi">psi</option>
                <option value="MPa">MPa</option>
                <option value="hp">horsepower</option>
                <option value="kw">kilowatts</option>
            </select>
            <div style="text-align:center"><i class="fa-solid fa-arrow-right"></i></div>
            <select id="uc-to" class="form-input">
                <option value="N">newtons</option>
                <option value="lbf">lbf</option>
                <option value="MPa">MPa</option>
                <option value="psi">psi</option>
                <option value="kw">kilowatts</option>
                <option value="hp">horsepower</option>
            </select>
        </div>
        <div class="calc-results mt-4 p-3 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <h3 id="uc-result" class="text-gradient font-bold" style="font-size: 1.5rem;">4.448</h3>
        </div>
    `;
    const factors = {
        'lbf-N': 4.44822, 'N-lbf': 0.224809,
        'psi-MPa': 0.00689476, 'MPa-psi': 145.038,
        'hp-kw': 0.7457, 'kw-hp': 1.34102,
        'N-N':1, 'lbf-lbf':1, 'psi-psi':1, 'MPa-MPa':1, 'hp-hp':1, 'kw-kw':1
    };
    const calculate = () => {
        const val = parseFloat(document.getElementById("uc-val").value);
        const from = document.getElementById("uc-from").value;
        const to = document.getElementById("uc-to").value;
        const key = `${from}-${to}`;
        if(factors[key]) {
            document.getElementById("uc-result").innerText = (val * factors[key]).toFixed(4) + ` ${to}`;
        } else {
            document.getElementById("uc-result").innerText = "invalid pair";
        }
    };
    container.querySelectorAll("input, select").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 6. 2R PLANAR KINEMATICS (Inverse Kinematics)
// ----------------------------------------------------
function initKinematicsCalc() {
    const container = document.getElementById("calc-content-kinematics");
    container.innerHTML = `
        <p class="mb-3 text-sm text-secondary">calculate joint angles (θ₁, θ₂) to reach target (X, Y) for a 2R robotic arm.</p>
        <div class="calc-grid">
            <div class="input-group">
                <label>link 1 length (mm)</label>
                <input type="number" id="kin-l1" value="150" class="form-input">
            </div>
            <div class="input-group">
                <label>link 2 length (mm)</label>
                <input type="number" id="kin-l2" value="150" class="form-input">
            </div>
            <div class="input-group">
                <label>target X (mm)</label>
                <input type="number" id="kin-x" value="200" class="form-input">
            </div>
            <div class="input-group">
                <label>target Y (mm)</label>
                <input type="number" id="kin-y" value="100" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded flex-col text-center" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p id="kin-status" style="margin-bottom: 10px; font-weight: bold;"></p>
            <p><strong>shoulder angle (θ₁):</strong> <span id="kin-t1" class="text-gradient font-bold">0</span>°</p>
            <p><strong>elbow angle (θ₂):</strong> <span id="kin-t2" class="text-gradient font-bold">0</span>°</p>
        </div>
    `;
    const calculate = () => {
        const L1 = parseFloat(document.getElementById("kin-l1").value);
        const L2 = parseFloat(document.getElementById("kin-l2").value);
        const X = parseFloat(document.getElementById("kin-x").value);
        const Y = parseFloat(document.getElementById("kin-y").value);
        
        const distSq = X*X + Y*Y;
        const maxDist = L1 + L2;
        const statusEl = document.getElementById("kin-status");

        if (Math.sqrt(distSq) > maxDist) {
            statusEl.innerText = "target out of reach!";
            statusEl.style.color = "#ff4d4d";
            document.getElementById("kin-t1").innerText = "-";
            document.getElementById("kin-t2").innerText = "-";
            return;
        }
        
        statusEl.innerText = "target reachable (elbow up configuration).";
        statusEl.style.color = "var(--text-secondary)";

        const c2 = (distSq - L1*L1 - L2*L2) / (2 * L1 * L2);
        const s2 = Math.sqrt(1 - c2*c2); // Elbow up
        
        const theta2 = Math.atan2(s2, c2);
        const k1 = L1 + L2 * c2;
        const k2 = L2 * s2;
        const theta1 = Math.atan2(Y, X) - Math.atan2(k2, k1);

        document.getElementById("kin-t1").innerText = (theta1 * 180 / Math.PI).toFixed(2);
        document.getElementById("kin-t2").innerText = (theta2 * 180 / Math.PI).toFixed(2);
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 7. PID TUNING (Ziegler-Nichols)
// ----------------------------------------------------
function initPIDCalc() {
    const container = document.getElementById("calc-content-pid");
    container.innerHTML = `
        <p class="mb-3 text-sm text-secondary">estimate P, PI, or PID gains using the Ziegler-Nichols continuous cycling method.</p>
        <div class="calc-grid">
            <div class="input-group">
                <label>ultimate gain (Ku)</label>
                <input type="number" id="pid-ku" value="1.3" step="0.1" class="form-input">
            </div>
            <div class="input-group">
                <label>ultimate period (Tu) sec</label>
                <input type="number" id="pid-tu" value="0.4" step="0.1" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <table class="aesthetic-table" style="width: 100%; font-size: 0.85rem;">
                <thead>
                    <tr><th>type</th><th>Kp</th><th>Ki</th><th>Kd</th></tr>
                </thead>
                <tbody id="pid-table-body">
                </tbody>
            </table>
        </div>
    `;
    const calculate = () => {
        const Ku = parseFloat(document.getElementById("pid-ku").value);
        const Tu = parseFloat(document.getElementById("pid-tu").value);
        if(!Ku || !Tu) return;

        const p_kp = 0.5 * Ku;
        const pi_kp = 0.45 * Ku, pi_ki = (0.54 * Ku)/Tu;
        const pid_kp = 0.6 * Ku, pid_ki = (1.2 * Ku)/Tu, pid_kd = (0.075 * Ku * Tu);

        document.getElementById("pid-table-body").innerHTML = `
            <tr><td>P</td><td>${p_kp.toFixed(3)}</td><td>-</td><td>-</td></tr>
            <tr><td>PI</td><td>${pi_kp.toFixed(3)}</td><td>${pi_ki.toFixed(3)}</td><td>-</td></tr>
            <tr><td>PID</td><td>${pid_kp.toFixed(3)}</td><td>${pid_ki.toFixed(3)}</td><td>${pid_kd.toFixed(3)}</td></tr>
        `;
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 8. VIBRATION MODES
// ----------------------------------------------------
function initVibrationCalc() {
    const container = document.getElementById("calc-content-vibration");
    container.innerHTML = `
        <p class="mb-3 text-sm text-secondary">1 DOF mass-spring-damper characteristics.</p>
        <div class="calc-grid">
            <div class="input-group">
                <label>mass m (kg)</label>
                <input type="number" id="vib-m" value="10" class="form-input">
            </div>
            <div class="input-group">
                <label>stiffness k (N/m)</label>
                <input type="number" id="vib-k" value="1000" class="form-input">
            </div>
            <div class="input-group">
                <label>damping c (N·s/m)</label>
                <input type="number" id="vib-c" value="20" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>natural freq (ω_n):</strong> <span id="vib-wn" class="text-gradient font-bold">0</span> rad/s</p>
            <p><strong>damping ratio (ζ):</strong> <span id="vib-zeta" class="text-gradient font-bold">0</span></p>
            <p><strong>damped freq (ω_d):</strong> <span id="vib-wd" class="text-gradient font-bold">0</span> rad/s</p>
            <p id="vib-sys" class="mt-2 text-sm italic" style="color: #b3b3b3;"></p>
        </div>
    `;
    const calculate = () => {
        const m = parseFloat(document.getElementById("vib-m").value);
        const k = parseFloat(document.getElementById("vib-k").value);
        const c = parseFloat(document.getElementById("vib-c").value);
        
        if(!m || !k) return;

        const wn = Math.sqrt(k/m);
        const zeta = c / (2 * Math.sqrt(k*m));
        let wd = 0;
        let sys = "";

        if (zeta < 1) {
            wd = wn * Math.sqrt(1 - zeta*zeta);
            sys = "underdamped system";
        } else if (zeta === 1) {
            sys = "critically damped system";
        } else {
            sys = "overdamped system";
        }

        document.getElementById("vib-wn").innerText = wn.toFixed(3);
        document.getElementById("vib-zeta").innerText = zeta.toFixed(3);
        document.getElementById("vib-wd").innerText = wd > 0 ? wd.toFixed(3) : "N/A";
        document.getElementById("vib-sys").innerText = sys;
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 9. REYNOLDS NUMBER
// ----------------------------------------------------
function initReynoldsCalc() {
    const container = document.getElementById("calc-content-reynolds");
    container.innerHTML = `
        <div class="calc-grid">
            <div class="input-group">
                <label>density ρ (kg/m³)</label>
                <input type="number" id="rey-rho" value="998" class="form-input">
            </div>
            <div class="input-group">
                <label>velocity v (m/s)</label>
                <input type="number" id="rey-v" value="2" class="form-input">
            </div>
            <div class="input-group">
                <label>char. length L (m)</label>
                <input type="number" id="rey-l" value="0.05" class="form-input">
            </div>
            <div class="input-group">
                <label>dyn. viscosity μ (Pa·s)</label>
                <input type="number" id="rey-mu" value="0.001" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>Reynolds number (Re):</strong></p>
            <h3 id="rey-res" class="text-gradient font-bold" style="font-size:1.5rem;">0</h3>
            <p id="rey-regime" class="mt-2 text-sm italic" style="color: #b3b3b3;"></p>
        </div>
    `;
    const calculate = () => {
        const rho = parseFloat(document.getElementById("rey-rho").value);
        const v = parseFloat(document.getElementById("rey-v").value);
        const L = parseFloat(document.getElementById("rey-l").value);
        const mu = parseFloat(document.getElementById("rey-mu").value);
        
        if(!mu) return;
        const Re = (rho * v * L) / mu;
        document.getElementById("rey-res").innerText = Math.round(Re).toLocaleString();
        
        let reg = "";
        if (Re < 2300) reg = "laminar flow";
        else if (Re > 4000) reg = "turbulent flow";
        else reg = "transitional flow";
        document.getElementById("rey-regime").innerText = reg;
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 10. FEA PREPROCESSOR (1D Bar Stiffness)
// ----------------------------------------------------
function initFEACalc() {
    const container = document.getElementById("calc-content-fea");
    container.innerHTML = `
        <p class="mb-3 text-sm text-secondary">generates the local stiffness matrix [K] for a 1D axial bar element.</p>
        <div class="calc-grid">
            <div class="input-group">
                <label>cross area A (m²)</label>
                <input type="number" id="fea-a" value="0.01" class="form-input">
            </div>
            <div class="input-group">
                <label>Young's mod. E (Pa)</label>
                <input type="number" id="fea-e" value="200e9" class="form-input">
            </div>
            <div class="input-group">
                <label>length L (m)</label>
                <input type="number" id="fea-l" value="1.5" class="form-input">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>[K] matrix (N/m):</strong></p>
            <div class="font-mono text-sm mt-2 p-2 rounded" style="background: #000; color: #00ffcc;">
                <div id="fea-k11">0</div>
                <div id="fea-k21">0</div>
            </div>
        </div>
    `;
    const calculate = () => {
        const A = parseFloat(document.getElementById("fea-a").value);
        const E = parseFloat(document.getElementById("fea-e").value);
        const L = parseFloat(document.getElementById("fea-l").value);
        
        if(!L) return;
        const k = (A * E) / L;
        const kExp = k.toExponential(3);
        const nkExp = (-k).toExponential(3);
        
        document.getElementById("fea-k11").innerText = `[ ${kExp} , ${nkExp} ]`;
        document.getElementById("fea-k21").innerText = `[ ${nkExp} , ${kExp} ]`;
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}

// ----------------------------------------------------
// 11. TOPOLOGY OPT. EXPLORER (SIMP Penalty)
// ----------------------------------------------------
function initTopologyCalc() {
    const container = document.getElementById("calc-content-topology");
    container.innerHTML = `
        <p class="mb-3 text-sm text-secondary">solid isotropic material with penalization (SIMP) relation: E(x) = E_void + x^p(E_0 - E_void)</p>
        <div class="calc-grid">
            <div class="input-group" style="grid-column: span 2;">
                <label>relative density (x): <span id="top-x-val">0.35</span></label>
                <input type="range" id="top-x" min="0.01" max="1" step="0.01" value="0.35" style="width:100%;">
            </div>
            <div class="input-group" style="grid-column: span 2;">
                <label>penalization factor (p): <span id="top-p-val">3</span></label>
                <input type="range" id="top-p" min="1" max="5" step="0.1" value="3" style="width:100%;">
            </div>
        </div>
        <div class="calc-results mt-4 p-3 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border);">
            <p><strong>effective stiffness multiplier:</strong></p>
            <h3 id="top-res" class="text-gradient font-bold mt-1" style="font-size:1.5rem;">0</h3>
            <p class="text-xs mt-2" style="color: #888;">notice how intermediate densities (gray area) are heavily penalized at higher 'p' values to force the solver towards solid (1) or void (0).</p>
        </div>
    `;
    const calculate = () => {
        const x = parseFloat(document.getElementById("top-x").value);
        const p = parseFloat(document.getElementById("top-p").value);
        
        document.getElementById("top-x-val").innerText = x.toFixed(2);
        document.getElementById("top-p-val").innerText = p.toFixed(1);
        
        const E_mult = Math.pow(x, p);
        document.getElementById("top-res").innerText = E_mult.toFixed(4) + " * E_0";
    };
    container.querySelectorAll("input").forEach(el => el.addEventListener("input", calculate));
    calculate();
}
