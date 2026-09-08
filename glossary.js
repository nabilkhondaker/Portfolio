/* =========================================================
   TECHNICAL GLOSSARY – data + logic
   ========================================================= */

const GLOSSARY_CATEGORIES = [
  { id: "comp-mech", name: "computational mechanics / fea", color: "#ff6b35" },
  { id: "topo-opt", name: "topology optimization", color: "#00c9a7" },
  { id: "robot-kin", name: "robotics / kinematics", color: "#4ecdc4" },
  { id: "robot-ctrl", name: "robotics controls", color: "#45b7d1" },
  { id: "dynamics", name: "dynamics / classical mechanics", color: "#96ceb4" },
  { id: "num-methods", name: "numerical methods", color: "#ffeaa7" },
  { id: "cad-mfg", name: "cad / geometry / manufacturing", color: "#dfe6e9" },
  { id: "cfd", name: "cfd / fluid mechanics", color: "#74b9ff" },
  { id: "soft-eng", name: "software engineering", color: "#a29bfe" },
  { id: "web-viz", name: "web / visualization", color: "#fd79a8" },
  { id: "cps", name: "cyber-physical systems", color: "#e17055" },
  { id: "eng-method", name: "engineering methodology", color: "#00b894" },
  { id: "experimental", name: "experimental / measurement", color: "#fdcb6e" },
  { id: "math", name: "mathematical foundations", color: "#6c5ce7" },
  { id: "dyn-projects", name: "dynamics projects", color: "#00cec9" }
];

const GLOSSARY_DATA = [
  // ========== 1. COMPUTATIONAL MECHANICS / FEA ==========
  {
    id: "finite-element-method",
    term: "finite element method (FEM)",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "a numerical method that approximates continuous physical systems by breaking them into smaller, simpler pieces called elements.",
    definition: "the finite element method is a numerical technique for finding approximate solutions to boundary value problems for partial differential equations. instead of trying to solve the governing equations over an entire continuous domain at once, the domain is discretized into a finite number of smaller subdomains (elements) connected at nodes.",
    intuition: "imagine trying to predict how a complex bridge will bend under load. solving the continuous equations directly is almost impossible for arbitrary geometry. fem chops the bridge into thousands of simple triangles or tetrahedra, writes a simple algebraic approximation on each piece, then stitches all those little equations together into one big sparse system that a computer can actually solve.",
    equations: [
      { label: "global system", tex: "K u = f" },
      { label: "where", note: "K = global stiffness matrix, u = unknown displacement vector, f = applied force vector" }
    ],
    why: "almost every modern structural analysis, heat transfer, and multiphysics simulation is built on some form of fem. it is the bridge between continuum mechanics theory and practical engineering numbers.",
    inWork: "fem is the mathematical backbone of both the fea playground 2d and the fea generative cto engine. every compliance calculation, every sensitivity field, and every mesh convergence check ultimately reduces to assembling and solving Ku = f.",
    related: ["finite-element-analysis", "stiffness-matrix", "mesh", "boundary-condition", "sparse-matrix", "mesh-convergence"]
  },
  {
    id: "finite-element-analysis",
    term: "finite element analysis (FEA)",
    categories: ["comp-mech"],
    status: "used",
    level: "intermediate",
    short: "the practical application of the finite element method to predict structural, thermal, or multiphysics behavior of engineered components.",
    definition: "fea is the engineering practice of using the finite element method to analyze how a part or assembly will respond to loads, constraints, temperature, etc. it includes meshing, applying boundary conditions, solving the discrete system, and post-processing stresses, strains, and displacements.",
    intuition: "fem is the math. fea is the whole workflow you actually run: import geometry → mesh it → slap boundary conditions on → hit solve → look at stress plots and decide whether the design is safe.",
    why: "it lets you catch structural problems before you print or machine anything. it is also the foundation for topology optimization and generative design.",
    inWork: "both the fea playground and the generative cto engine are pure fea tools. the lab journal entries on mesh convergence, sparse assembly, and stress recovery are all fea validation work.",
    related: ["finite-element-method", "mesh", "stiffness-matrix", "safety-factor", "stress-concentration"]
  },
  {
    id: "mesh",
    term: "mesh",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "foundational",
    short: "the discrete geometric representation of a continuous domain, made of nodes and elements.",
    definition: "a mesh is a collection of nodes (points) and elements (lines, triangles, tetrahedra, etc.) that approximate a continuous geometry so that numerical methods can be applied.",
    intuition: "think of it as a wireframe or a grid laid over the part. the finer the mesh, the closer the discrete model gets to the real continuous object — but also the more degrees of freedom you have to solve.",
    why: "mesh quality and density directly control both accuracy and computational cost. a bad mesh can produce completely wrong stresses even if the solver is perfect.",
    inWork: "mesh generation and refinement show up constantly in the lab journal — especially the memory-spike abort when the 2r robot meshes got too fine and the browser heap limit experiments in the fea playground.",
    related: ["mesh-density", "mesh-refinement", "mesh-convergence", "element-quality", "mesh-distortion"]
  },
  {
    id: "mesh-convergence",
    term: "mesh convergence",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the process of refining a mesh until the solution stops changing meaningfully, proving that discretization error is under control.",
    definition: "mesh convergence studies systematically increase mesh density (or decrease element size) and monitor a quantity of interest (displacement, stress, frequency, etc.). when further refinement produces negligible change, the solution is considered mesh-converged.",
    intuition: "if you keep cutting the elements in half and the max stress only moves by 0.3 %, you can finally trust the number. if it jumps 15 % every time you refine, you are still looking at discretization error, not physics.",
    why: "without convergence evidence, any stress or displacement plot is just a pretty picture with unknown accuracy.",
    inWork: "the lab journal entry from 2026-08-09 records an aborted mesh convergence study on the 2r planar robot that ran out of memory. that failure directly drove the switch to selective refinement and out-of-core ideas.",
    related: ["mesh", "mesh-refinement", "discretization-error", "element-quality"]
  },
  {
    id: "stiffness-matrix",
    term: "stiffness matrix",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the matrix that relates nodal displacements to nodal forces for an element or an entire structure.",
    definition: "the stiffness matrix K maps a vector of nodal displacements u to the corresponding vector of nodal forces f via Ku = f. for linear elasticity it is symmetric and positive-definite (after boundary conditions are applied).",
    intuition: "each column of K tells you what force pattern you need to apply to produce a unit displacement at one particular degree of freedom while holding all others fixed. it is the discrete version of the continuous elasticity operator.",
    equations: [
      { label: "element level", tex: "k^e u^e = f^e" },
      { label: "after assembly", tex: "K u = f" }
    ],
    why: "assembling and solving the global stiffness system is the core computational step of almost every linear structural analysis.",
    inWork: "the custom c++ coo→csr converter and the pure-js assembler in the fea playground both exist solely to build and solve stiffness matrices efficiently. the 2026-04-27 journal entry documents an off-by-one bug in the sparse format that was caught by a patch-test unit test.",
    related: ["global-stiffness-matrix", "sparse-matrix", "element-assembly", "degrees-of-freedom"]
  },
  {
    id: "sparse-matrix",
    term: "sparse matrix",
    categories: ["comp-mech", "num-methods", "soft-eng"],
    status: "used",
    level: "intermediate",
    short: "a matrix in which most entries are zero, stored and operated on using specialized formats that skip the zeros.",
    definition: "sparse matrices arise naturally in finite-element and finite-difference discretizations because each node only interacts with its immediate neighbors. formats such as coo, csr, and csc store only the nonzero values plus index information.",
    intuition: "a 50 000-dof stiffness matrix is theoretically 50k × 50k = 2.5 billion entries. in practice it has maybe 15–20 nonzeros per row. storing the zeros would waste gigabytes and make every multiply 1000× slower.",
    why: "without sparse linear algebra, industrial-scale fea would be impossible on any machine that exists today.",
    inWork: "the fea generative engine uses scipy sparse matrices. the pure-js playground had to stream the stiffness matrix in blocks and move assembly into a web worker precisely because dense storage was not an option.",
    related: ["csr-format", "coo-format", "nnz", "matrix-conditioning"]
  },
  {
    id: "boundary-condition",
    term: "boundary condition",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "foundational",
    short: "a constraint or load applied on the boundary of the domain that makes the problem well-posed.",
    definition: "boundary conditions specify either the value of the primary variable (dirichlet) or the value of the flux / traction (neumann) on parts of the domain boundary. without them the discrete system is singular.",
    intuition: "a free-floating structure has rigid-body modes. fixing a few nodes (dirichlet) or applying known forces (neumann) removes those modes and lets the solver produce a unique solution.",
    why: "incorrect or incomplete boundary conditions are one of the most common sources of nonsense results in fea.",
    inWork: "every analysis in the playground and the generative engine starts by applying supports and loads. the journal frequently mentions how changing boundary conditions completely changes the optimal topology.",
    related: ["dirichlet-boundary-condition", "neumann-boundary-condition", "degrees-of-freedom"]
  },
  {
    id: "degrees-of-freedom",
    term: "degrees of freedom (DOF)",
    categories: ["comp-mech", "robot-kin", "num-methods"],
    status: "used",
    level: "foundational",
    short: "the independent coordinates needed to completely describe the configuration of a system.",
    definition: "in structural mechanics each free nodal displacement or rotation is a degree of freedom. in robotics the joint angles (or prismatic displacements) are the dofs of the manipulator.",
    intuition: "a 2d truss node has 2 translational dofs. a 3d solid node has 3. a 2r planar arm has exactly 2 joint dofs. the size of the global stiffness matrix is equal to the number of free dofs.",
    why: "dof count is the primary driver of both computational cost and the complexity of the kinematic or dynamic equations.",
    inWork: "the 2r robot is deliberately a 2-dof system so the inverse-kinematics and jacobian analysis stay analytically tractable. the vehicle dynamics sim is a 14-dof model — that is why it needs careful integration and parallelization.",
    related: ["configuration-space", "jacobian", "stiffness-matrix"]
  },

  // ========== 2. TOPOLOGY OPTIMIZATION ==========
  {
    id: "topology-optimization",
    term: "topology optimization",
    categories: ["topo-opt", "comp-mech"],
    status: "used",
    level: "advanced",
    short: "a computational method that redistributes material inside a design domain to maximize performance under given constraints.",
    definition: "topology optimization finds the optimal material layout within a prescribed design domain by treating the material density (or presence/absence) at every point as a design variable. the most common formulation minimizes compliance subject to a volume fraction constraint.",
    intuition: "instead of starting with a solid block and carving material away by hand, you tell the computer the loads, the supports, and how much material you are allowed to use. it then grows the load paths that actually carry force and deletes everything else, often producing organic, bone-like structures.",
    why: "it is the mathematical engine behind generative design and the reason aerospace brackets and automotive parts look the way they do today.",
    inWork: "the fea generative cto engine is a pure topology-optimization code. the entire lab-journal series on volume-fraction sweeps, density filters, heaviside projection, and manufacturing constraints exists because of this project.",
    related: ["simp", "compliance", "volume-fraction", "sensitivity-filtering", "heaviside-projection"]
  },
  {
    id: "simp",
    term: "SIMP",
    categories: ["topo-opt"],
    status: "used",
    level: "advanced",
    short: "solid isotropic material with penalization — the most widely used material interpolation scheme in density-based topology optimization.",
    definition: "simp interpolates the young’s modulus of an element as E(ρ) = E₀ ρ^p where ρ ∈ [0,1] is the density design variable and p ≥ 3 is the penalization exponent. intermediate densities are made inefficient, driving the optimizer toward a crisp 0-1 design.",
    intuition: "if you leave the exponent at 1, the optimizer is happy to keep lots of gray (half-density) material. raising the power makes gray material artificially weak, so the algorithm prefers pure solid or pure void.",
    equations: [
      { label: "material interpolation", tex: "E(\\rho) = E_0 \\rho^p" },
      { label: "typical range", note: "p = 3 is the classic starting value; continuation on p is often used" }
    ],
    why: "without penalization the optimizer produces unprintable intermediate-density regions. simp is the simplest practical way to push the solution toward manufacturable black-and-white designs.",
    inWork: "every volume-fraction sweep recorded in the journal (2026-08-14 and earlier) uses simp. the notes on gray-scale intermediate densities and the later push on projection β are direct consequences of the simp formulation.",
    related: ["topology-optimization", "penalization", "density-field", "heaviside-projection"]
  },
  {
    id: "compliance",
    term: "compliance",
    categories: ["topo-opt", "comp-mech"],
    status: "used",
    level: "intermediate",
    short: "a scalar measure of structural flexibility; the work done by the applied loads (or equivalently uᵀKu).",
    definition: "in linear elasticity compliance is defined as C = fᵀu = uᵀKu. minimizing compliance is equivalent to maximizing global stiffness for a given load case.",
    intuition: "low compliance means the structure barely moves under the design loads. high compliance means it is floppy. topology optimization almost always starts by minimizing compliance.",
    why: "it is a smooth, differentiable objective that correlates well with many practical stiffness requirements and has an efficient adjoint sensitivity.",
    inWork: "the generative cto engine’s primary objective is compliance minimization. the journal repeatedly tracks how compliance changes with volume fraction and filter radius.",
    related: ["topology-optimization", "objective-function", "stiffness-matrix"]
  },
  {
    id: "volume-fraction",
    term: "volume fraction",
    categories: ["topo-opt"],
    status: "used",
    level: "foundational",
    short: "the fraction of the design domain that is allowed to be solid material.",
    definition: "volume fraction V_f = (∫_Ω ρ dV) / |Ω| is the main resource constraint in density-based topology optimization. typical values range from 0.2 to 0.5 depending on the application.",
    intuition: "if you set V_f = 0.3 the optimizer is only allowed to keep 30 % of the material. it has to decide which 30 % actually carries load and delete the rest.",
    why: "it is the simplest and most important constraint that forces the optimizer to produce a meaningful lightweight design instead of just filling the entire domain with solid.",
    inWork: "the 2026-08-14 journal entry documents a full volume-fraction sweep from 0.2 to 0.55 on a cantilever. the 0.35 design produced the cleanest load path.",
    related: ["topology-optimization", "constraint", "density-field"]
  },
  {
    id: "heaviside-projection",
    term: "heaviside projection",
    categories: ["topo-opt"],
    status: "used",
    level: "advanced",
    short: "a smooth approximation of the heaviside step function used to force intermediate densities toward 0 or 1 after filtering.",
    definition: "after the density filter, a projection ρ̃ = H(ρ̄, β, η) is applied. as the continuation parameter β → ∞ the projection approaches a sharp step at the threshold η, producing nearly discrete designs.",
    intuition: "the filter alone still leaves a band of gray. the heaviside projection is the final “make it black or white” step that improves manufacturability.",
    why: "it dramatically reduces intermediate densities while still allowing gradient-based optimization through a smooth approximation.",
    inWork: "the journal notes that gray-scale was still present at r_min = 1.5 and that the next planned run would push projection β higher. volume drift after projection is also discussed as an open question.",
    related: ["simp", "density-filter", "continuation", "volume-constraint-enforcement"]
  },
  {
    id: "density-filter",
    term: "density filter",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "a convolution operation that smooths the density field over a characteristic length scale, eliminating checkerboarding and imposing a minimum length scale.",
    definition: "the filtered density at a point is a weighted average of the design variables inside a circular (or spherical) neighborhood of radius r_min. the filter is usually linear and density-based.",
    intuition: "without a filter the optimizer loves to create alternating solid-void checkerboard patterns that are numerically stiff but physically meaningless and unprintable. the filter forces neighboring elements to have similar densities.",
    why: "it is the standard cure for checkerboarding and the simplest way to control minimum member size.",
    inWork: "filter radius is a recurring parameter in the journal. the morphological-closing experiments for manufacturing constraints are built on top of the same length-scale idea.",
    related: ["checkerboarding", "minimum-member-size", "length-scale-control", "sensitivity-filtering"]
  },

  // ========== 3. ROBOTICS / KINEMATICS ==========
  {
    id: "jacobian",
    term: "jacobian",
    categories: ["robot-kin", "math", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the matrix of partial derivatives that maps joint velocities to end-effector velocities (and vice-versa via its inverse or pseudoinverse).",
    definition: "for a robot with joint configuration q and end-effector pose x(q), the jacobian is J(q) = ∂x/∂q. it provides the linear map ẋ = J(q) q̇ between joint space and task space velocities.",
    intuition: "it answers the question: if i nudge each joint by a tiny amount, which way and how fast does the end effector move? when the jacobian loses rank, some directions of end-effector motion become impossible — those are the singularities.",
    equations: [
      { label: "velocity map", tex: "\\dot{x} = J(q)\\dot{q}" },
      { label: "2r planar example", tex: "J = \\begin{bmatrix} -L_1\\sin q_1 - L_2\\sin(q_1+q_2) & -L_2\\sin(q_1+q_2) \\\\ L_1\\cos q_1 + L_2\\cos(q_1+q_2) & L_2\\cos(q_1+q_2) \\end{bmatrix}" }
    ],
    why: "it is the central object for differential inverse kinematics, singularity detection, manipulability analysis, and resolved-rate control.",
    inWork: "the 2r planar robot inverse-kinematics system uses the analytical jacobian. near the workspace boundary the determinant approached zero and the numerical solver started oscillating between elbow configurations. a soft barrier plus hysteresis and later damped least-squares (λ = 0.02) were added to keep the solution stable.",
    related: ["inverse-kinematics", "singularity", "damped-least-squares", "pseudoinverse", "differential-kinematics"]
  },
  {
    id: "inverse-kinematics",
    term: "inverse kinematics",
    categories: ["robot-kin"],
    status: "used",
    level: "intermediate",
    short: "the problem of finding joint angles that place the end effector at a desired cartesian pose.",
    definition: "given a desired end-effector position (and possibly orientation) x_d, inverse kinematics solves for a joint configuration q such that the forward map f(q) = x_d. analytical solutions exist for simple geometries; numerical methods are required for more complex arms.",
    intuition: "forward kinematics is easy: you turn the joints and the math tells you where the tip is. inverse kinematics is the harder reverse question — “i want the tip here, what joint angles get me there?”",
    why: "almost every real robot task is specified in cartesian space (pick that object, follow this path). the controller ultimately needs joint commands, so ik is unavoidable.",
    inWork: "the 2r planar robot uses an analytical ik solution. the lab journal documents the elbow-flip singularity near the outer reach circle and the subsequent addition of hysteresis and damped least-squares to keep the numerical path continuous.",
    related: ["forward-kinematics", "jacobian", "singularity", "configuration-space", "damped-least-squares"]
  },
  {
    id: "forward-kinematics",
    term: "forward kinematics",
    categories: ["robot-kin"],
    status: "used",
    level: "foundational",
    short: "the mapping from joint configuration to end-effector pose.",
    definition: "forward kinematics computes the position and orientation of the end effector given the current joint angles (or displacements). it is usually obtained by successive homogeneous transformations along the kinematic chain.",
    intuition: "you know every joint angle; the fk equations just multiply the link lengths and angles together to tell you where the tip sits in space.",
    why: "it is the foundation for both visualization and for setting up the inverse problem. every jacobian is derived from the forward map.",
    inWork: "both the physical 2r arm and the three.js robosim use forward kinematics for overlay visualization and for verifying that the inverse solution actually reaches the target.",
    related: ["inverse-kinematics", "homogeneous-transformation", "kinematic-chain"]
  },
  {
    id: "singularity",
    term: "singularity",
    categories: ["robot-kin"],
    status: "used",
    level: "intermediate",
    short: "a configuration where the jacobian loses rank and the robot instantaneously loses the ability to move in one or more task-space directions.",
    definition: "at a singular configuration det(J) = 0 (or rank(J) < task dimension). the mapping from joint velocity to end-effector velocity becomes many-to-one or undefined in some directions, and inverse-kinematics solutions either diverge or become non-unique.",
    intuition: "when a 2r arm is fully stretched out, the two links are collinear. no amount of joint motion can produce a force or velocity along the line of the arm — that direction is lost. that is a singularity.",
    why: "singularities cause inverse-kinematics solvers to blow up, produce discontinuous joint trajectories, or demand infinite joint rates for finite cartesian motion. they must be detected and handled.",
    inWork: "the 2026-07-28 journal entry is entirely about the singularity near the workspace boundary of the 2r arm and the practical fixes (hysteresis + damped least-squares) that were added.",
    related: ["jacobian", "damped-least-squares", "workspace-boundary", "inverse-kinematics"]
  },
  {
    id: "damped-least-squares",
    term: "damped least squares",
    categories: ["robot-kin", "num-methods"],
    status: "used",
    level: "advanced",
    short: "a regularization technique that keeps inverse-kinematics solutions well-behaved near singularities by adding a damping term to the jacobian pseudoinverse.",
    definition: "instead of the pure pseudoinverse solution Δq = J⁺ Δx, damped least squares solves Δq = Jᵀ (J Jᵀ + λ² I)⁻¹ Δx. the damping factor λ prevents the solution from exploding when the smallest singular value of J approaches zero.",
    intuition: "near a singularity the pure inverse tries to command huge joint velocities to produce a tiny cartesian move. damping tells the solver “prefer smaller joint motions even if the cartesian error is not driven all the way to zero.”",
    equations: [
      { label: "damped solution", tex: "\\Delta q = J^T (J J^T + \\lambda^2 I)^{-1} \\Delta x" }
    ],
    why: "it is one of the simplest and most effective practical fixes for singularity-robust inverse kinematics.",
    inWork: "after the 2r analytical solver started flipping configurations, damped least-squares with λ = 0.02 was added. cartesian residual stayed under 0.4 mm across the singular band.",
    related: ["jacobian", "singularity", "pseudoinverse", "inverse-kinematics"]
  },

  // ========== 4. ROBOTICS CONTROLS ==========
  {
    id: "pid-controller",
    term: "PID controller",
    categories: ["robot-ctrl"],
    status: "used",
    level: "intermediate",
    short: "a classical feedback controller that applies corrective action proportional to the error, its integral, and its derivative.",
    definition: "the control law is u(t) = K_p e(t) + K_i ∫e(τ)dτ + K_d de/dt, where e is the tracking error between the desired setpoint and the measured output.",
    intuition: "proportional term fights the current error, integral term slowly eliminates steady-state offset, derivative term damps overshoot by looking at how fast the error is changing.",
    why: "it is still the workhorse of industrial and academic motion control because it is simple, effective, and relatively easy to tune.",
    inWork: "the physical 2r arm uses independent pid loops on each joint. the 2026-07-12 journal entry documents the retune after a 150 g tip load caused overshoot, the addition of coulomb friction feed-forward, and the residual gravity-related steady-state error that was later compensated.",
    related: ["proportional-gain", "integral-gain", "derivative-gain", "overshoot", "steady-state-error"]
  },
  {
    id: "overshoot",
    term: "overshoot",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the amount by which the system response exceeds the final steady-state value after a step change in setpoint.",
    definition: "percent overshoot is (peak value − steady value) / steady value × 100 %. it is a direct measure of how aggressive the transient response is.",
    intuition: "too much proportional or too little derivative gain and the arm flies past the target angle before settling. that overshoot can cause collisions or excite unmodeled resonances.",
    why: "in physical robots overshoot is often more dangerous than slow rise time, so it is one of the first metrics watched during gain tuning.",
    inWork: "after the first transfer of simulated gains to the real 2r hardware, joint 1 showed roughly 9 % overshoot on a 0 → 45° step. increasing the derivative term by ~30 % brought it under control.",
    related: ["pid-controller", "settling-time", "damping"]
  },
  {
    id: "steady-state-error",
    term: "steady-state error",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the residual difference between the desired setpoint and the actual output after all transients have died out.",
    definition: "for a unity-feedback system the steady-state error depends on the open-loop type and the form of the reference (step, ramp, etc.). integral action is the classic way to drive step-error to zero.",
    intuition: "the arm gets close to the target angle but sits a fraction of a degree off forever. that leftover offset is steady-state error — often caused by gravity, friction, or insufficient integral gain.",
    why: "many tasks (holding a precise pose, tracking a slow trajectory) care more about final accuracy than about how fast the system arrived.",
    inWork: "the 2r shoulder still showed a ~0.7° residual that scaled with cos(θ). a static gravity compensation term using measured link masses removed most of it; the rest was attributed to cable stretch and gearbox compliance.",
    related: ["pid-controller", "integral-gain", "gravity-compensation"]
  },
  {
    id: "lqr",
    term: "LQR",
    categories: ["robot-ctrl", "math"],
    status: "studied",
    level: "advanced",
    short: "linear quadratic regulator — an optimal state-feedback controller that minimizes a quadratic cost on state and control effort.",
    definition: "for a linear system ẋ = Ax + Bu, lqr finds the gain matrix K that minimizes ∫ (xᵀ Q x + uᵀ R u) dt. the optimal control is u = −Kx, where K is obtained from the algebraic riccati equation.",
    intuition: "you tell the optimizer how much you hate state error (Q) versus how much you hate using control energy (R). it returns the cheapest feedback gains that keep the system well-behaved.",
    why: "it gives a systematic way to design multi-input multi-output controllers and automatically handles state coupling that independent pids ignore.",
    inWork: "the inverted triple-pendulum simulation compared an lqr controller against three independent pids. lqr stabilized larger initial angles; the decoupled pids started fighting each other once the coupling springs became active.",
    related: ["state-space-model", "cost-function", "pole", "stability"]
  },

  // ========== 5. DYNAMICS ==========
  {
    id: "coefficient-of-restitution",
    term: "coefficient of restitution",
    categories: ["dynamics", "dyn-projects"],
    status: "used",
    level: "intermediate",
    short: "a dimensionless measure of how elastic a collision is; e = 1 is perfectly elastic, e = 0 is perfectly plastic.",
    definition: "the coefficient of restitution e is the ratio of relative velocity of separation to relative velocity of approach along the contact normal. it appears in the impact map that relates pre- and post-impact velocities.",
    intuition: "e = 1 means the bodies bounce apart with the same relative speed they approached. e = 0 means they stick or the relative normal velocity becomes zero after impact.",
    why: "it is the simplest practical way to inject realistic energy loss (or conservation) into rigid-body impact models without resolving the full contact deformation.",
    inWork: "the two-disk bouncing-plate simulation (ds1) was originally formulated with e = 1. an energy-drift bug was traced to a position-level penetration correction that injected artificial kinetic energy; switching to a velocity-level constraint with the same e map fixed the drift.",
    related: ["elastic-collision", "contact-impulse", "energy-drift", "velocity-level-constraint"]
  },
  {
    id: "energy-drift",
    term: "energy drift",
    categories: ["dynamics", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the slow artificial growth or decay of total mechanical energy caused by numerical integration or inconsistent impact resolution.",
    definition: "in a conservative mechanical system the sum of kinetic and potential energy should stay constant. any numerical scheme that fails to respect this (or an impact map that injects or removes energy) produces observable energy drift over long simulations.",
    intuition: "you start a bouncing simulation with a known energy. after 30 seconds of simulated time the energy has climbed 0.4 %. that growth is pure numerical artifact and will eventually destroy the qualitative behavior.",
    why: "long-duration dynamics simulations are useless if energy is not conserved to acceptable tolerance. it is one of the first diagnostics run on any new integrator or contact model.",
    inWork: "the 2026-06-18 journal entry documents exactly this problem in the spring-coupled disk simulation and the switch to a velocity-level non-penetration constraint that brought drift below 0.05 %.",
    related: ["numerical-integration", "contact-impulse", "coefficient-of-restitution", "time-integration"]
  },
  {
    id: "inverted-pendulum",
    term: "inverted pendulum",
    categories: ["dynamics", "robot-ctrl", "dyn-projects"],
    status: "used",
    level: "intermediate",
    short: "a pendulum whose mass is above its pivot; the upright position is an unstable equilibrium that requires active control to maintain.",
    definition: "an inverted pendulum has its center of mass above the pivot. the linearized equations about the upright equilibrium possess at least one eigenvalue with positive real part, so the open-loop system is unstable.",
    intuition: "balancing a broom on your hand is an inverted pendulum. without continuous corrective torque the broom falls. the same physics appears in rocket control, segways, and many under-actuated robots.",
    why: "it is the classic unstable system used to test control algorithms. multi-link inverted pendulums quickly become chaotic and expose the limits of linear controllers.",
    inWork: "dynamics simulation ds12 is three inverted pendulums sharing a common pivot and coupled by springs. the journal records the open-loop eigenvalues and the successful stabilization by lqr versus the partial success of independent pids.",
    related: ["lqr", "stability", "linearization", "state-space-model"]
  },

  // ========== 6. NUMERICAL METHODS ==========
  {
    id: "conjugate-gradient",
    term: "conjugate gradient (CG)",
    categories: ["num-methods", "comp-mech"],
    status: "used",
    level: "advanced",
    short: "an iterative krylov-subspace method for solving symmetric positive-definite linear systems without forming the matrix inverse.",
    definition: "cg generates a sequence of conjugate search directions and minimizes the a-norm of the error over the growing krylov subspace. for an n × n spd matrix it theoretically converges in at most n steps, but good preconditioning makes it practical far sooner.",
    intuition: "instead of factoring the huge stiffness matrix, you only need matrix-vector products. each iteration improves the residual along a direction that is conjugate to all previous ones, so you never waste effort repeating work.",
    why: "it is the default iterative solver for large sparse spd systems that appear in linear elasticity and many other elliptic pdes.",
    inWork: "the pure-js fea playground uses a conjugate-gradient solver. the journal records that the browser tab crashed once the mesh exceeded ~12 k elements; moving the entire assembly + cg solve into a web worker removed the main-thread freeze.",
    related: ["iterative-solver", "preconditioning", "krylov-subspace", "sparse-matrix"]
  },
  {
    id: "newton-raphson",
    term: "newton-raphson method",
    categories: ["num-methods"],
    status: "studied",
    level: "intermediate",
    short: "an iterative root-finding algorithm that linearizes the residual at the current guess and solves the resulting linear system for the next update.",
    definition: "given a nonlinear residual r(x) = 0, the newton update is x_{k+1} = x_k − J(x_k)⁻¹ r(x_k), where J is the jacobian of r. quadratic convergence is obtained when the initial guess is close enough and J remains nonsingular.",
    intuition: "you approximate the nonlinear function by its tangent line (or hyperplane) and jump to where that tangent crosses zero. repeat until the residual is small.",
    why: "it is the workhorse for solving the nonlinear equations that appear in large-deformation mechanics, contact, and many inverse problems.",
    inWork: "the mechgenpro engine uses newton-raphson inside its kinematic solvers for linkage position analysis.",
    related: ["jacobian", "nonlinear-solver", "convergence"]
  },

  // ========== 7. CAD / MANUFACTURING ==========
  {
    id: "fdm",
    term: "FDM",
    categories: ["cad-mfg"],
    status: "used",
    level: "foundational",
    short: "fused deposition modeling — the most common consumer additive-manufacturing process that extrudes thermoplastic filament layer by layer.",
    definition: "fdm builds parts by melting a polymer filament and depositing it in successive layers. strength is highly anisotropic: interlayer bonds are significantly weaker than the bulk filament direction.",
    intuition: "the printer is basically a hot-glue gun on a robot arm that draws the part one thin slice at a time. the interfaces between those slices are the weak planes.",
    why: "almost every rapid prototype in a student lab is an fdm print. understanding its anisotropy is essential for correlating fea predictions with physical failure.",
    inWork: "the first pla print of the 2r forearm link cracked at the root fillet after ~40 cycles. post-mortem showed layer adhesion failure. reprinting at 100 % infill with rotated orientation fixed it, and a 0.4 knockdown factor was applied to the allowable stress to bring analysis and test into agreement.",
    related: ["layer-adhesion", "anisotropy", "knockdown-factor", "print-orientation", "infill"]
  },
  {
    id: "knockdown-factor",
    term: "knockdown factor",
    categories: ["cad-mfg", "comp-mech"],
    status: "used",
    level: "intermediate",
    short: "an empirical reduction applied to material allowable stress to account for real-world effects that the ideal analysis does not capture.",
    definition: "a knockdown factor multiplies the handbook or coupon strength to produce a conservative design allowable. typical sources are anisotropy, surface finish, residual stress, environmental degradation, or process variability.",
    intuition: "the textbook says the material is good for 48 mpa. the actual printed part failed at a stress that corresponds to only ~18 mpa in the weak direction. dividing by a knockdown of ~0.4 brings the numbers back in line.",
    why: "without it, fea safety factors computed from ideal isotropic properties are optimistic and unsafe for additive parts.",
    inWork: "after the 2r link failure, tensile coupons printed with the same settings gave interlayer strength of ~18 mpa versus ~48 mpa in the filament direction. a 0.4 knockdown brought predicted and observed failure loads into agreement.",
    related: ["safety-factor", "anisotropy", "fdm", "allowable-stress"]
  },
  {
    id: "layer-adhesion",
    term: "layer adhesion",
    categories: ["cad-mfg"],
    status: "used",
    level: "foundational",
    short: "the strength of the bond between successive deposited layers in an additive manufacturing process.",
    definition: "in fdm the molten filament must thermally fuse with the previous layer. incomplete fusion produces a weak interlayer interface whose tensile strength can be a small fraction of the bulk material.",
    intuition: "the part is only as strong as the glue between the layers. if that glue is weak, the part delaminates under load even if the filament itself is strong.",
    why: "it is the dominant failure mode for many fdm structural parts and the reason print orientation and process parameters matter so much.",
    inWork: "the cracked 2r forearm link failed exactly at a layer interface 0.6 mm above the fillet. that observation drove both the reprint strategy and the knockdown factor.",
    related: ["fdm", "anisotropy", "print-orientation"]
  },

  // ========== 8. CFD ==========
  {
    id: "lattice-boltzmann-method",
    term: "lattice boltzmann method (LBM)",
    categories: ["cfd", "num-methods"],
    status: "used",
    level: "advanced",
    short: "a mesoscopic cfd method that evolves particle distribution functions on a discrete lattice; macroscopic fluid behavior emerges from simple collision and streaming rules.",
    definition: "lbm discretizes the boltzmann equation in velocity space. at each lattice node a set of distribution functions streams to neighboring nodes and then collides toward a local equilibrium. density and momentum are recovered as moments of the distributions.",
    intuition: "instead of solving the navier-stokes equations directly, you pretend the fluid is a bunch of particles that can only move in a few discrete directions. collide them the right way and the average behavior looks like a real fluid.",
    why: "it is straightforward to implement, handles complex boundaries with bounce-back rules, and parallelizes extremely well — making it attractive for interactive and educational solvers.",
    inWork: "the cfd solver project is a pure javascript lbm implementation that runs at interactive frame rates in the browser. typed arrays and careful memory layout were required to keep it at 60 fps.",
    related: ["navier-stokes-equations", "reynolds-number", "bounce-back-boundary-condition"]
  },

  // ========== 9. SOFTWARE ENGINEERING ==========
  {
    id: "web-worker",
    term: "web worker",
    categories: ["web-viz", "soft-eng"],
    status: "used",
    level: "intermediate",
    short: "a browser api that runs javascript in a background thread so heavy computation does not freeze the user interface.",
    definition: "a web worker is an independent javascript context that communicates with the main thread only through asynchronous message passing (postmessage). it has no access to the dom.",
    intuition: "the main thread has to keep the page responsive and paint frames. anything that takes more than a few milliseconds will make the ui stutter. a worker lets you move the heavy linear algebra or mesh assembly off the main thread.",
    why: "browser-based scientific computing is only usable if the ui stays alive. workers are the standard solution.",
    inWork: "both the fea playground (assembly + cg solve) and the earlier memory-spike experiments ended up moving the heavy path into a web worker. transferable arraybuffers were used to avoid structured-clone overhead.",
    related: ["main-thread", "typed-array", "postmessage", "heap"]
  },
  {
    id: "typed-array",
    term: "typed array",
    categories: ["web-viz", "soft-eng", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "a javascript array-like view over a raw binary buffer that stores numbers in a specific native format (float32, float64, int32, …).",
    definition: "typed arrays (float32array, float64array, etc.) provide cache-friendly, contiguous storage and allow the js engine to generate efficient machine code for numerical loops. they are also the only way to transfer large numeric buffers to web workers or webgl without copying.",
    intuition: "a normal javascript array can hold anything and is slow. a float32array is just a block of memory that the cpu can stream through at nearly native speed.",
    why: "any serious numerical code in the browser eventually has to leave ordinary arrays behind.",
    inWork: "the lbm cfd solver and the fea playground both rely on float32arrays for the core fields. the journal notes that temporary typed arrays created during element-wise assembly were a major source of heap pressure before the worker rewrite.",
    related: ["web-worker", "arraybuffer", "heap", "memory-leak"]
  },

  // ========== 10. WEB / VISUALIZATION ==========
  {
    id: "fragment-shader",
    term: "fragment shader",
    categories: ["web-viz"],
    status: "used",
    level: "intermediate",
    short: "a gpu program that runs once per pixel (fragment) and decides the final color written to the framebuffer.",
    definition: "in the webgl/opengl pipeline the fragment shader receives interpolated vertex attributes and any uniform data, then outputs a color (and optionally depth). it is the last programmable stage before raster operations.",
    intuition: "the vertex shader positions the geometry; the fragment shader paints every pixel of that geometry. for scientific visualization it is often used to map a scalar field to a color scale.",
    why: "real-time density-field and isosurface visualization in the browser is only possible because the color mapping can be done entirely on the gpu.",
    inWork: "the live density visualization in the topology-optimization tool used a fragment shader. on mobile the mediump precision collapsed small density differences into the same color band; forcing highp restored smooth gradients.",
    related: ["webgl", "shader", "highp", "color-mapping"]
  },
  {
    id: "highp",
    term: "highp",
    categories: ["web-viz"],
    status: "used",
    level: "foundational",
    short: "the highest precision qualifier available for floating-point variables in glsl; typically 32-bit float on desktop and many mobile gpus.",
    definition: "glsl precision qualifiers (lowp, mediump, highp) tell the driver how much numeric precision is required. highp is the only qualifier that guarantees enough mantissa bits for smooth scientific color maps and stable iterative calculations.",
    intuition: "mediump on a mali gpu effectively gave about 10 bits of mantissa. density values that differed by less than ~0.002 collapsed to the same color, making the optimizer look frozen even though the cpu-side numbers were still changing.",
    why: "visualization bugs that only appear on mobile are frequently precision problems. highp is the blunt but reliable fix.",
    inWork: "the 2026-03-14 journal entry is the exact post-mortem of this issue. forcing highp in the density fragment shader restored the visual and confirmed the underlying optimizer was fine.",
    related: ["fragment-shader", "mediump", "floating-point-precision"]
  },

  // ========== 11. CYBER-PHYSICAL ==========
  {
    id: "cyber-physical-system",
    term: "cyber-physical system (CPS)",
    categories: ["cps"],
    status: "learning",
    level: "intermediate",
    short: "an engineered system that tightly integrates computation, networking, and physical processes.",
    definition: "a cps embeds software and network communication inside a physical plant so that the computing elements monitor and control the physical behavior in real time. examples include industrial control systems, autonomous vehicles, and smart grids.",
    intuition: "the 2r arm with camera feedback and pid loops is a small cps. the same idea scaled up is a power plant or a robotic assembly line.",
    why: "as mechanical systems acquire more sensors, actuators, and software, the boundary between “the machine” and “the computer” disappears. security and correctness then become joint cyber-physical problems.",
    inWork: "listed as an explicit area of interest on the site. no production cps security project has been completed yet, so the whole category remains in the learning / exploring state.",
    related: ["industrial-control-system", "embedded-system", "white-hat-security"]
  },

  // ========== 12. ENGINEERING METHODOLOGY ==========
  {
    id: "validation",
    term: "validation",
    categories: ["eng-method", "experimental"],
    status: "used",
    level: "foundational",
    short: "the process of confirming that a model or simulation accurately represents the real physical system of interest.",
    definition: "validation asks “are we solving the right equations for the real world?” it compares simulation predictions against experimental measurements or trusted reference data. it is distinct from verification (which asks “are we solving the equations correctly?”).",
    intuition: "your fea code can be perfectly bug-free and still give wrong answers if the material model, boundary conditions, or load assumptions do not match reality. validation is the experimental check that catches that mismatch.",
    why: "without validation, simulation results are only hypotheses. every serious engineering decision needs evidence that the model is faithful enough for the intended use.",
    inWork: "the entire 2r arm control-transfer story (simulated gains → real hardware → observed overshoot and residual error → gravity compensation) is a validation loop. the fdm link failure and subsequent knockdown factor is another.",
    related: ["verification", "experimental-validation", "benchmark"]
  },
  {
    id: "verification",
    term: "verification",
    categories: ["eng-method", "num-methods"],
    status: "used",
    level: "foundational",
    short: "the process of confirming that a numerical implementation correctly solves the mathematical equations it claims to solve.",
    definition: "verification checks code correctness against manufactured solutions, analytical benchmarks, or highly refined reference solutions. it does not claim that the equations themselves describe reality — only that the discrete solution matches the continuous math.",
    intuition: "you can verify a stiffness-matrix assembler by checking that the sum of all entries equals the known dense result for a tiny patch. that test says nothing about whether the underlying continuum model is right for the physical part.",
    why: "bugs in assembly, boundary-condition application, or solver tolerances produce plausible-looking but completely wrong results. verification is the only systematic way to catch them.",
    inWork: "the 2026-04-27 journal entry describes exactly this: a unit test that builds a 3-element patch, converts coo→csr, and asserts that the frobenius norm of (k_sparse − k_dense) is below 1e-12. that test caught the off-by-one indexing bug.",
    related: ["validation", "patch-test", "benchmark", "unit-test"]
  },

  // ========== 13. EXPERIMENTAL ==========
  {
    id: "post-mortem",
    term: "post-mortem",
    categories: ["experimental", "eng-method"],
    status: "used",
    level: "foundational",
    short: "a structured examination of a failed part, experiment, or simulation to determine the root cause and extract lessons.",
    definition: "after a physical failure or a simulation crash, a post-mortem collects evidence (fracture surfaces, log files, residual plots, material coupons) and reconstructs the sequence of events that led to the unwanted outcome.",
    intuition: "the part cracked. instead of just reprinting and hoping, you cut it open, look at the fracture surface, measure the actual interlayer strength, and update both the manufacturing process and the analysis allowables.",
    why: "failures are expensive teachers. a good post-mortem turns a broken part into permanent process knowledge.",
    inWork: "the 2r forearm link failure received a full post-mortem: crack initiation site, layer orientation, coupon tests, and the resulting knockdown factor. the memory-spike and energy-drift incidents in the journal are software post-mortems.",
    related: ["root-cause-analysis", "failure-analysis", "experimental-validation"]
  },

  // ========== 14. MATHEMATICAL FOUNDATIONS ==========
  {
    id: "gradient",
    term: "gradient",
    categories: ["math", "topo-opt", "num-methods"],
    status: "used",
    level: "foundational",
    short: "the vector of partial derivatives of a scalar function; it points in the direction of steepest ascent.",
    definition: "for a scalar function f(x), the gradient ∇f is the vector whose components are ∂f/∂x_i. in optimization it supplies the direction used by gradient-based algorithms; in continuum mechanics it appears in strain and heat-flux definitions.",
    intuition: "if you stand on a hillside, the gradient of height is the vector that points straight uphill. take a step in the opposite direction and you descend fastest.",
    why: "almost every continuous optimization method, every sensitivity analysis, and every constitutive law that involves rates ultimately needs gradients.",
    inWork: "topology optimization is driven by the sensitivity (gradient) of compliance with respect to the density variables. the adjoint method is used precisely because forming those gradients by finite differences would be prohibitively expensive.",
    related: ["sensitivity-analysis", "adjoint-method", "objective-function"]
  },
  {
    id: "adjoint-method",
    term: "adjoint method",
    categories: ["math", "topo-opt", "num-methods"],
    status: "used",
    level: "advanced",
    short: "an efficient technique for computing the gradient of an objective with respect to many design variables by solving one additional linear system.",
    definition: "when the objective depends on the solution of a state equation (e.g. Ku = f), the adjoint method introduces a dual variable λ that satisfies a transposed system. the gradient with respect to all design variables can then be obtained from a single matrix-vector product involving λ.",
    intuition: "finite differences would require one extra solve per design variable. the adjoint needs only one extra solve total, regardless of how many densities you have. that is why large-scale topology optimization is practical.",
    why: "it is the enabling technology for gradient-based topology optimization with tens or hundreds of thousands of design variables.",
    inWork: "the generative cto engine uses the adjoint method for compliance sensitivities. the journal explicitly notes that the sensitivity field was computed with the adjoint approach and that each volume step took 42–48 oc iterations.",
    related: ["sensitivity-analysis", "gradient", "topology-optimization", "compliance"]
  },

  // ========== 15. DYNAMICS PROJECTS (specialized) ==========
  {
    id: "harmonic-excitation",
    term: "harmonic excitation",
    categories: ["dyn-projects", "dynamics"],
    status: "used",
    level: "intermediate",
    short: "a forcing function that varies sinusoidally in time at a single frequency.",
    definition: "harmonic excitation is a load or base motion of the form F(t) = F₀ sin(ωt) or F₀ cos(ωt). the steady-state response of a linear system is also harmonic at the same frequency, with amplitude and phase determined by the frequency-response function.",
    intuition: "shake a structure at one pure frequency long enough and every linear mode that can be excited will settle into a constant-amplitude oscillation at that same frequency.",
    why: "it is the simplest realistic dynamic load case and the foundation for modal testing, vibration isolation studies, and resonance avoidance.",
    inWork: "several of the dynamics simulations (ds2, ds3, …) are driven by harmonic base motion or harmonic forces in the 3–5 rad/s range. the journal entries on those models focus on energy transfer and mode coupling under that excitation.",
    related: ["angular-frequency", "resonance", "base-excitation", "forced-vibration"]
  },
  {
    id: "base-excitation",
    term: "base excitation",
    categories: ["dyn-projects", "dynamics"],
    status: "used",
    level: "intermediate",
    short: "a prescribed motion of the support or foundation of a system, used as the input instead of an applied force.",
    definition: "in a base-excitation problem the displacement (or acceleration) of the support is given as a function of time. the absolute motion of the masses is then the sum of the base motion and the relative motion across the springs/dampers.",
    intuition: "instead of pushing on the mass, you shake the floor the mass is sitting on. earthquakes, vehicle ride, and shaker-table tests are all base-excitation problems.",
    why: "many real vibration environments are more naturally described as motion inputs than as force inputs.",
    inWork: "the multi-body block-and-rod system (ds2) is subjected to harmonic base excitation. deriving the effective forcing that appears in the relative coordinates was one of the modeling points noted in the project description.",
    related: ["harmonic-excitation", "forced-vibration", "vibration-isolation"]
  },
  {
    id: "finite-element",
    term: "finite element",
    categories: ["comp-mech"],
    status: "used",
    level: "foundational",
    short: "the basic building block of a finite-element mesh — a simple geometric shape (triangle, tetrahedron, etc.) with assumed approximate solution behavior inside it.",
    definition: "a finite element is a subdomain of the discretized continuum on which the unknown field (displacement, temperature, etc.) is approximated by simple shape functions. nodes at the element corners (and sometimes mid-sides) carry the degrees of freedom that are solved for globally.",
    intuition: "instead of trying to describe the whole structure with one complicated function, you cover it with many tiny pieces and use a simple polynomial on each piece. the pieces talk to each other only through the shared nodes.",
    why: "everything in fem — stiffness matrices, assembly, mesh quality — ultimately lives at the element level.",
    inWork: "both the fea playground and the generative cto engine assemble element stiffness matrices before scattering them into the global system. element type and order directly affect accuracy and cost.",
    related: ["mesh", "node", "shape-function", "element-assembly", "stiffness-matrix"]
  },
  {
    id: "node",
    term: "node",
    categories: ["comp-mech"],
    status: "used",
    level: "foundational",
    short: "a point in the mesh that carries one or more degrees of freedom (displacements, rotations, temperatures, etc.).",
    definition: "nodes are the discrete locations where the primary unknowns of the finite-element problem are defined. elements connect nodes, and the global system size is determined by the total number of free nodal dofs.",
    intuition: "think of the mesh as a set of pins (nodes) connected by rubber bands or rigid bars (elements). the pins are what actually move when the structure deforms.",
    why: "boundary conditions are applied at nodes, results are reported at nodes, and the size of Ku = f is exactly the number of free nodal dofs.",
    inWork: "mesh refinement studies in the journal are really about increasing node density in critical regions while keeping the far-field coarse enough to stay under memory limits.",
    related: ["mesh", "degrees-of-freedom", "finite-element", "boundary-condition"]
  },
  {
    id: "shape-function",
    term: "shape function",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the interpolation functions used inside an element to reconstruct the field from nodal values.",
    definition: "shape functions N_i map the nodal degrees of freedom to a continuous field inside the element: u(x) ≈ Σ N_i(x) u_i. they are usually low-order polynomials chosen so that they equal 1 at their own node and 0 at all other nodes of the element.",
    intuition: "once you know the displacements at the corners of a triangle, the shape functions tell you the displacement at every point inside that triangle by smooth interpolation.",
    why: "the quality of the approximation, the sparsity pattern of the element matrix, and the ability to represent rigid-body modes all depend on the choice of shape functions.",
    inWork: "linear triangular elements (constant-strain) are the workhorse in the 2d playground and the generative engine because they keep assembly simple and the code easy to verify.",
    related: ["finite-element", "element-assembly", "stiffness-matrix"]
  },
  {
    id: "element-assembly",
    term: "element assembly",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the process of scattering each element’s local stiffness and force contributions into the global system matrices and vectors.",
    definition: "after the local element matrix k^e and force vector f^e are formed, assembly maps the local degrees of freedom to their global indices and adds the contributions into the global K and f. the mapping is usually stored as a connectivity array.",
    intuition: "each little element only “knows” its own nodes. assembly is the bookkeeping step that puts every element’s numbers into the correct rows and columns of the giant global matrix.",
    why: "assembly is where the sparse structure of K is born and where indexing bugs (off-by-one, wrong connectivity) most often appear.",
    inWork: "the 2026-04-27 journal entry documents an off-by-one bug in the coo→csr converter that only showed up on certain mesh sizes; a 3-element patch test caught it.",
    related: ["stiffness-matrix", "sparse-matrix", "local-to-global-mapping", "coo-format"]
  },
  {
    id: "dirichlet-boundary-condition",
    term: "dirichlet boundary condition",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "foundational",
    short: "a boundary condition that directly prescribes the value of the primary unknown (e.g. fixed displacement).",
    definition: "dirichlet conditions set u = ū on part of the boundary. in the discrete system they are enforced by eliminating those degrees of freedom or by modifying the rows of K and f so the prescribed values are satisfied exactly.",
    intuition: "nailing a node to a fixed location is a dirichlet condition. the solver is no longer allowed to move that dof; it becomes a known number instead of an unknown.",
    why: "without enough dirichlet conditions the global stiffness matrix is singular (rigid-body modes remain).",
    inWork: "every structural solve in the playground and the generative engine starts by applying support constraints as dirichlet conditions on selected nodes.",
    related: ["boundary-condition", "neumann-boundary-condition", "degrees-of-freedom"]
  },
  {
    id: "neumann-boundary-condition",
    term: "neumann boundary condition",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "foundational",
    short: "a boundary condition that prescribes the flux or traction (derivative of the primary unknown) on part of the boundary.",
    definition: "neumann conditions specify the value of the normal derivative or the traction vector on the boundary. in structural mechanics they appear as applied forces or pressures and are assembled directly into the global force vector.",
    intuition: "pushing on a face with a known force is a neumann condition. the displacement on that face is still free; only the force balance is prescribed.",
    why: "loads are almost always neumann data. mixing them correctly with dirichlet supports is what makes a well-posed boundary-value problem.",
    inWork: "point loads and distributed pressures in the cantilever benchmarks and the 2r stress checks are applied as neumann data on the appropriate nodes or edges.",
    related: ["boundary-condition", "dirichlet-boundary-condition", "force-vector"]
  },
  {
    id: "youngs-modulus",
    term: "young's modulus",
    categories: ["comp-mech", "cad-mfg"],
    status: "used",
    level: "foundational",
    short: "the slope of the linear portion of the uniaxial stress–strain curve; a measure of material stiffness.",
    definition: "young’s modulus E is defined by σ = E ε in uniaxial tension or compression within the linear-elastic range. it has units of stress (pa, mpa, gpa) and appears in every isotropic linear-elastic constitutive law.",
    intuition: "a high young’s modulus means the material barely stretches under load (steel). a low value means it stretches a lot (rubber).",
    why: "it is the single most important material parameter for linear structural analysis and for the stiffness interpolation used in simp.",
    inWork: "the generative engine and the playground both take E as a user or material input. the fdm knockdown work effectively reduces the usable E (and strength) in the weak direction.",
    related: ["poisson-ratio", "linear-elasticity", "constitutive-model", "simp"]
  },
  {
    id: "poisson-ratio",
    term: "poisson's ratio",
    categories: ["comp-mech"],
    status: "used",
    level: "foundational",
    short: "the negative ratio of transverse strain to axial strain under uniaxial loading.",
    definition: "poisson’s ratio ν = −ε_transverse / ε_axial. for most metals it lies between 0.25 and 0.35; for incompressible materials it approaches 0.5. it appears in the isotropic elasticity tensor alongside young’s modulus.",
    intuition: "when you stretch a rubber band it gets thinner. poisson’s ratio quantifies how much thinner.",
    why: "it controls the coupling between volumetric and shear response and affects the conditioning of the stiffness matrix near the incompressible limit.",
    inWork: "standard isotropic linear-elastic material cards in both fea tools use a user-supplied or default poisson ratio together with young’s modulus.",
    related: ["youngs-modulus", "linear-elasticity", "constitutive-model"]
  },
  {
    id: "safety-factor",
    term: "safety factor",
    categories: ["comp-mech", "cad-mfg", "eng-method"],
    status: "used",
    level: "foundational",
    short: "the ratio of a material’s allowable or failure strength to the actual stress expected in service.",
    definition: "factor of safety n = σ_allowable / σ_applied (or load_failure / load_service). values greater than 1 indicate margin; the required magnitude depends on uncertainty, consequences of failure, and code requirements.",
    intuition: "if the part is predicted to see 50 mpa and the material fails at 150 mpa, the safety factor is 3. you keep that margin because real loads, real material, and real geometry are never perfect.",
    why: "it is the simplest quantitative way to turn an analysis result into a go / no-go design decision.",
    inWork: "the 2r forearm link was originally designed to a safety factor of ~2.1 based on isotropic pla properties. after the layer-adhesion failure a knockdown was applied, which effectively lowered the usable safety factor until the reprint orientation fixed the weak plane.",
    related: ["knockdown-factor", "allowable-stress", "stress-concentration"]
  },
  {
    id: "stress-concentration",
    term: "stress concentration",
    categories: ["comp-mech"],
    status: "used",
    level: "intermediate",
    short: "a local elevation of stress caused by geometric discontinuities such as holes, fillets, notches, or sharp corners.",
    definition: "the stress-concentration factor k_t is the ratio of the peak local stress to the nominal far-field stress. it is a purely geometric quantity for linear elasticity and can be read from charts or computed by fine-mesh fea.",
    intuition: "force flow lines have to squeeze around a hole or a sharp re-entrant corner, so the stress spikes there even if the average stress is modest.",
    why: "fatigue cracks and brittle fractures almost always start at stress concentrations. ignoring them is a common way to get surprised by premature failure.",
    inWork: "the root fillet of the 2r forearm link was the initiation site of the layer-adhesion crack. mesh refinement studies near that fillet were part of the post-mortem.",
    related: ["mesh-refinement", "safety-factor", "fillet"]
  },
  {
    id: "coo-format",
    term: "coo format",
    categories: ["comp-mech", "num-methods", "soft-eng"],
    status: "used",
    level: "intermediate",
    short: "coordinate (triplet) storage for a sparse matrix: three arrays holding row index, column index, and value for every nonzero.",
    definition: "coo stores a sparse matrix as three parallel arrays (row, col, val). it is the most convenient format for incremental assembly because you can simply append triplets and sort/sum them later.",
    intuition: "instead of a giant 2-d array full of zeros, you keep a list of (i, j, value) for every entry that is not zero. assembly just pushes more triplets onto the list.",
    why: "almost every finite-element code first builds the matrix in coo (or a closely related triplet form) and then converts to csr/csc for the actual solve.",
    inWork: "the custom c++ assembler and the pure-js playground both accumulate element contributions as coo triplets before converting to csr. the off-by-one bug lived in that conversion step.",
    related: ["csr-format", "sparse-matrix", "nnz", "element-assembly"]
  },
  {
    id: "csr-format",
    term: "csr format",
    categories: ["comp-mech", "num-methods", "soft-eng"],
    status: "used",
    level: "intermediate",
    short: "compressed sparse row storage — the standard format for fast matrix-vector products with general sparse matrices.",
    definition: "csr stores three arrays: values (the nonzeros in row-major order), column indices (matching the values), and row pointers (the starting offset of each row in the other two arrays). matrix-vector multiplication then streams contiguously through memory.",
    intuition: "once the matrix is finished, you never need random access to arbitrary (i,j) entries again — you only need to multiply by vectors. csr makes that multiply cache-friendly.",
    why: "iterative solvers (cg, gmres, \ldots) spend almost all their time in sparse matrix-vector products; csr is the format that makes those products fast.",
    inWork: "both the scipy path in the generative engine and the hand-written js/c++ converters target csr for the subsequent conjugate-gradient solves.",
    related: ["coo-format", "sparse-matrix", "conjugate-gradient", "nnz"]
  },
  {
    id: "nnz",
    term: "nonzero (nnz)",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "foundational",
    short: "the number of nonzero entries in a sparse matrix; the primary measure of matrix storage and arithmetic cost.",
    definition: "nnz is simply the count of entries that are not zero. for a typical 2-d linear finite-element stiffness matrix nnz is on the order of 10–20 times the number of degrees of freedom.",
    intuition: "a dense n×n matrix has n² entries. a sparse one with the same n may have only 15n nonzeros. that factor of n is the difference between fitting in memory and not.",
    why: "memory use, factorization fill-in, and the cost of every matrix-vector product all scale with nnz, not with n².",
    inWork: "the journal entry on the aborted mesh-convergence study quotes an nnz of about 2.4×10⁷ for the refined shoulder mesh — enough to push the pure-numpy path past the process memory limit.",
    related: ["sparse-matrix", "csr-format", "coo-format"]
  },
  {
    id: "patch-test",
    term: "patch test",
    categories: ["comp-mech", "num-methods", "eng-method"],
    status: "used",
    level: "intermediate",
    short: "a simple verification problem that checks whether an element formulation can represent constant stress (or constant strain) states exactly.",
    definition: "a small patch of elements is subjected to boundary conditions that should produce a known constant stress field. if the computed nodal stresses and displacements match the analytical constant field to machine precision, the element passes the patch test.",
    intuition: "if even a constant-stress state is wrong, the element is fundamentally broken. the patch test is the first filter every new element implementation has to pass.",
    why: "it is the quickest rigorous way to catch assembly bugs, wrong shape-function derivatives, or incorrect constitutive evaluations.",
    inWork: "the unit test that caught the coo→csr off-by-one error builds a 3-element patch, converts formats, and asserts that the frobenius norm of the difference against a dense reference is below 1e-12.",
    related: ["verification", "element-assembly", "stiffness-matrix"]
  },
  {
    id: "design-domain",
    term: "design domain",
    categories: ["topo-opt"],
    status: "used",
    level: "foundational",
    short: "the geometric region inside which the optimizer is allowed to distribute material.",
    definition: "the design domain Ω is the fixed region that contains all candidate material points. non-design regions (solid or void that must stay unchanged) can be carved out of it. the volume fraction constraint is always expressed relative to the measure of Ω.",
    intuition: "you draw a box (or a more complicated shape) and tell the optimizer “you may only put material inside this box.” everything outside is off-limits.",
    why: "it defines the feasible set of the topology optimization problem and is the region that must be meshed.",
    inWork: "every cantilever and 2-d benchmark in the generative engine starts with an explicit rectangular design domain and optional non-design solid supports or load pads.",
    related: ["topology-optimization", "volume-fraction", "non-design-region"]
  },
  {
    id: "density-field",
    term: "density field",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "the spatially varying design variable field ρ(x) ∈ [0,1] that indicates how much material is present at each point.",
    definition: "in density-based topology optimization the design is represented by a scalar field ρ that is discretized at the element (or nodal) level. ρ = 1 is solid, ρ = 0 is void, and intermediate values are penalized by simp or projected away.",
    intuition: "the optimizer is painting a grayscale image over the design domain. black is material, white is empty, gray is the temporary compromise that the penalization and projection try to eliminate.",
    why: "it is the fundamental design variable of the most widely used topology-optimization formulation.",
    inWork: "the live density visualization, the volume-fraction sweeps, and the heaviside projection experiments in the journal all operate directly on this field.",
    related: ["simp", "volume-fraction", "heaviside-projection", "density-filter"]
  },
  {
    id: "penalization",
    term: "penalization",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "the practice of making intermediate densities artificially inefficient so the optimizer prefers pure solid or pure void.",
    definition: "in simp the young’s modulus is interpolated as E(ρ) = E₀ ρ^p with p > 1. because stiffness grows slower than volume for intermediate ρ, the optimizer is driven toward the discrete 0-1 limits.",
    intuition: "if half-density material gives you far less than half the stiffness, the algorithm quickly learns that gray is a bad bargain and pushes every element toward black or white.",
    why: "without penalization the optimizer happily leaves large gray regions that cannot be manufactured.",
    inWork: "the journal repeatedly notes the presence of residual gray at modest filter radii and the subsequent use of continuation on the penalization exponent or on the projection parameter β.",
    related: ["simp", "intermediate-density", "continuation", "heaviside-projection"]
  },
  {
    id: "optimality-criteria",
    term: "optimality criteria (oc)",
    categories: ["topo-opt"],
    status: "used",
    level: "advanced",
    short: "a fixed-point update scheme commonly used in topology optimization that rescales densities according to the ratio of sensitivity to the lagrange multiplier of the volume constraint.",
    definition: "the classical oc update is ρ_new = ρ_old × (sensitivity / (λ × volume_sensitivity))^η, followed by a projection onto the admissible density box and a bisection search on λ to enforce the volume constraint exactly.",
    intuition: "elements that give a lot of stiffness per unit volume get denser; elements that give little get thinner. the lagrange multiplier λ is adjusted until the total volume matches the target.",
    why: "it is simple, fast, and works surprisingly well for compliance minimization with a single volume constraint — the workhorse problem of topology optimization.",
    inWork: "the generative cto engine uses an oc update. the journal records 42–48 oc iterations per volume-fraction step to reach a relative change below 1e-4.",
    related: ["topology-optimization", "sensitivity-analysis", "volume-fraction", "continuation"]
  },
  {
    id: "continuation",
    term: "continuation",
    categories: ["topo-opt", "num-methods"],
    status: "used",
    level: "advanced",
    short: "the gradual increase of a difficult parameter (penalization exponent, projection β, etc.) so the optimizer can track a path of solutions instead of jumping straight to a hard non-convex problem.",
    definition: "continuation (or homotopy) methods start with a relaxed, almost convex problem and slowly tighten the parameters that introduce non-convexity. each intermediate solution is used as the warm start for the next, harder problem.",
    intuition: "if you turn the penalization up to 3 on the first iteration the optimizer can get stuck in a bad local minimum. if you start at 1 and ramp up, it has a chance to find a better basin.",
    why: "many topology-optimization problems become severely non-convex once projection or high penalization is active; continuation is the practical way to keep convergence reliable.",
    inWork: "the planned increase of the heaviside projection parameter β and the earlier volume-fraction sweeps are both forms of continuation.",
    related: ["heaviside-projection", "penalization", "optimality-criteria"]
  },
  {
    id: "checkerboarding",
    term: "checkerboarding",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "the alternating solid-void pattern that appears in topology optimization when no length-scale control is present; it is numerically stiff but physically meaningless.",
    definition: "checkerboarding is a numerical instability in which neighboring elements take opposite density values (1-0-1-0\ldots). the artificial stiffness of the pattern is an artifact of the element formulation and the lack of a filter or other regularization.",
    intuition: "the optimizer discovers that a checkerboard of solid and void elements looks stiffer on a coarse mesh than a smooth solid region of the same volume. the pattern cannot be manufactured and disappears under mesh refinement or filtering.",
    why: "it is the classic symptom that the problem is under-regularized. density filters or sensitivity filters are the standard cure.",
    inWork: "the density filter (and later morphological closing) in the generative engine exists primarily to suppress checkerboarding and to impose a minimum member size.",
    related: ["density-filter", "mesh-dependency", "minimum-member-size"]
  },
  {
    id: "minimum-member-size",
    term: "minimum member size",
    categories: ["topo-opt", "cad-mfg"],
    status: "used",
    level: "intermediate",
    short: "a manufacturability constraint that prevents the optimizer from producing structural members thinner than a prescribed length scale.",
    definition: "minimum-member-size control is usually realized by a density or sensitivity filter whose radius is tied to the desired minimum feature width, sometimes combined with a morphological closing operation.",
    intuition: "if the printer or the milling tool cannot reliably make a 0.5 mm strut, there is no point letting the optimizer create one. the filter radius becomes a proxy for that process limit.",
    why: "without it the optimizer freely generates needle-thin members that look great in the density plot and fail in the real world.",
    inWork: "the journal entry on manufacturing constraints explicitly sets the closing radius to 1.2× the intended minimum member width and accepts the resulting ~8 % compliance penalty.",
    related: ["density-filter", "length-scale-control", "morphological-closing", "design-for-manufacturability"]
  },
  {
    id: "configuration-space",
    term: "configuration space",
    categories: ["robot-kin"],
    status: "used",
    level: "intermediate",
    short: "the space whose coordinates are the robot’s joint variables; each point corresponds to one complete posture of the mechanism.",
    definition: "for an n-dof serial chain the configuration space is typically an n-dimensional torus or a subset thereof. obstacles, joint limits, and singularities appear as forbidden regions or lower-dimensional subsets inside this space.",
    intuition: "instead of thinking about the arm in 3-d cartesian space, you think about a point moving inside an n-dimensional box (or torus) whose axes are the joint angles.",
    why: "path planning, singularity avoidance, and many theoretical results are most naturally stated in configuration space.",
    inWork: "the 2r analytical ik produces two configurations (elbow-up / elbow-down) for most reachable points; the journal describes the need for hysteresis so the solver does not chatter between those two points in configuration space when the target is near the workspace boundary.",
    related: ["inverse-kinematics", "workspace", "singularity", "joint-space"]
  },
  {
    id: "workspace",
    term: "workspace",
    categories: ["robot-kin"],
    status: "used",
    level: "foundational",
    short: "the set of all points (or poses) that the end effector can reach.",
    definition: "the reachable workspace is the image of the configuration space under the forward-kinematics map. for a 2r planar arm it is an annular region bounded by |L₁−L₂| and L₁+L₂.",
    intuition: "draw every possible tip position the arm can touch; the resulting blob is the workspace. points outside it are simply unreachable.",
    why: "task locations must lie inside the workspace, and the quality of inverse kinematics (and the proximity to singularities) changes dramatically near the boundary.",
    inWork: "the singularity and hysteresis work on the 2r arm was driven by targets approaching the outer reach circle — exactly the workspace boundary.",
    related: ["reachable-workspace", "inverse-kinematics", "singularity", "forward-kinematics"]
  },
  {
    id: "end-effector",
    term: "end effector",
    categories: ["robot-kin"],
    status: "used",
    level: "foundational",
    short: "the tool or gripper at the distal end of a robotic manipulator; the part whose pose is usually the task variable.",
    definition: "the end effector is the last link in the kinematic chain. its position and orientation are the quantities that inverse kinematics tries to control and that the jacobian maps joint velocities onto.",
    intuition: "everything the robot does in the world ultimately happens at the end effector — the gripper, the welding torch, the paddle, etc.",
    why: "almost every motion-planning and control specification is written in terms of end-effector pose or velocity.",
    inWork: "the 2r planar “paddle” is the end effector. both the analytical ik and the jacobian analysis are written with respect to its cartesian position.",
    related: ["forward-kinematics", "inverse-kinematics", "jacobian", "task-space"]
  },
  {
    id: "homogeneous-transformation",
    term: "homogeneous transformation",
    categories: ["robot-kin", "math"],
    status: "used",
    level: "intermediate",
    short: "a 4×4 matrix that simultaneously represents a rotation and a translation, allowing rigid-body motions to be composed by ordinary matrix multiplication.",
    definition: "a homogeneous transform T = [ R  t ; 0  1 ] packs a 3×3 rotation matrix R and a 3×1 translation t into a single 4×4 matrix. successive frames along a kinematic chain are multiplied to obtain the pose of the end effector.",
    intuition: "instead of keeping rotation and translation as two separate objects that you have to apply in the right order, you put them in one matrix and just multiply.",
    why: "it is the standard bookkeeping tool for serial-chain forward kinematics and for scene-graph transforms in 3-d graphics.",
    inWork: "both the physical 2r code and the three.js robosim use homogeneous transforms (or their 2-d analogues) to propagate link poses from base to tip.",
    related: ["forward-kinematics", "rotation-matrix", "transformation-matrix"]
  },
  {
    id: "pseudoinverse",
    term: "pseudoinverse",
    categories: ["robot-kin", "math", "num-methods"],
    status: "used",
    level: "advanced",
    short: "a generalized matrix inverse that exists even for rectangular or rank-deficient matrices; commonly used to solve under- or over-determined linear systems.",
    definition: "the moore-penrose pseudoinverse A⁺ satisfies the four penrose conditions and gives the minimum-norm least-squares solution to Ax = b. for a full-rank jacobian it reduces to the ordinary left or right inverse.",
    intuition: "when the jacobian is not square or is singular, you cannot invert it. the pseudoinverse still gives you the “best possible” joint velocity that realizes a desired cartesian velocity in the least-squares sense.",
    why: "it is the starting point for resolved-rate motion control and for the damped least-squares regularization used near singularities.",
    inWork: "the damped least-squares formula used on the 2r arm is exactly a regularized pseudoinverse: Jᵀ(JJᵀ + λ²I)⁻¹.",
    related: ["jacobian", "damped-least-squares", "inverse-kinematics", "moore-penrose-pseudoinverse"]
  },
  {
    id: "proportional-gain",
    term: "proportional gain",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the k_p term in a pid controller that produces a corrective action proportional to the current error.",
    definition: "u_p = k_p e. larger k_p reduces rise time and steady-state error for many plants, but excessive values produce overshoot and can destabilize the loop.",
    intuition: "the farther you are from the target, the harder the controller pushes. that push is scaled by k_p.",
    why: "it is the first gain most people tune and the one that most directly trades speed against stability.",
    inWork: "the initial transfer of simulated gains to the physical 2r arm produced noticeable overshoot; the subsequent retune raised the derivative term while keeping proportional action in a stable range.",
    related: ["pid-controller", "derivative-gain", "integral-gain", "overshoot"]
  },
  {
    id: "derivative-gain",
    term: "derivative gain",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the k_d term in a pid controller that produces a corrective action proportional to the rate of change of error.",
    definition: "u_d = k_d de/dt. derivative action damps the response and reduces overshoot, but it amplifies high-frequency noise and can make the actuator chatter if the signal is not filtered.",
    intuition: "if the error is shrinking quickly, derivative action eases off so you do not fly past the setpoint. if the error is growing, it pushes harder.",
    why: "it is the primary knob for controlling overshoot and settling behavior on mechanical systems with inertia.",
    inWork: "after the 150 g tip-load test the shoulder joint’s derivative gain was increased by ~30 % to bring the 9 % overshoot back down.",
    related: ["pid-controller", "proportional-gain", "overshoot", "damping"]
  },
  {
    id: "integral-gain",
    term: "integral gain",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the k_i term in a pid controller that accumulates past error and drives steady-state offset to zero.",
    definition: "u_i = k_i ∫ e(τ) dτ. integral action eliminates constant disturbances and steady-state error at the cost of slower response and the risk of wind-up when the actuator saturates.",
    intuition: "if a small error persists for a long time, the integral term slowly builds up until the error is finally pushed to zero.",
    why: "gravity bias, friction, and other constant loads leave a residual offset that pure proportional control cannot remove.",
    inWork: "the residual 0.7° gravity-related offset on the 2r shoulder was ultimately removed by an explicit gravity-compensation feed-forward rather than by cranking integral gain alone.",
    related: ["pid-controller", "steady-state-error", "integral-windup"]
  },
  {
    id: "settling-time",
    term: "settling time",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the time required for the system response to enter and remain inside a specified error band around the final value.",
    definition: "commonly the 2 % or 5 % settling time is reported. it is a direct measure of how long the transient lasts after a step reference or disturbance.",
    intuition: "how long do you have to wait before the arm is “close enough” and stays there.",
    why: "cycle time and productivity in real tasks are often limited by settling time rather than by pure rise time.",
    inWork: "the retuned 2r shoulder step response (0 → 45°) settled in 0.38 s with 9 % overshoot after the derivative increase.",
    related: ["overshoot", "rise-time", "pid-controller", "step-response"]
  },
  {
    id: "state-space-model",
    term: "state-space model",
    categories: ["robot-ctrl", "math", "dynamics"],
    status: "studied",
    level: "advanced",
    short: "a first-order vector differential equation ẋ = Ax + Bu, y = Cx + Du that describes a linear system in terms of its internal state.",
    definition: "the state vector x contains enough information to predict the future evolution of the system given the input u. the matrices A, B, C, D completely characterize a linear time-invariant system.",
    intuition: "instead of a high-order scalar ode you keep a list of first-order variables (positions, velocities, currents, \ldots) and write how each one depends on the others and on the inputs.",
    why: "modern control design (lqr, pole placement, kalman filters, \ldots) is almost always done in state space.",
    inWork: "the inverted triple-pendulum study linearized the nonlinear equations about the upright equilibrium to obtain a state-space model that was then used for lqr design.",
    related: ["lqr", "eigenvalue", "linearization", "controllability"]
  },
  {
    id: "moment-of-inertia",
    term: "moment of inertia",
    categories: ["dynamics", "robot-kin"],
    status: "used",
    level: "foundational",
    short: "the rotational analogue of mass; a measure of an object’s resistance to angular acceleration about a given axis.",
    definition: "for a rigid body I = ∫ r² dm. it appears in the rotational form of newton’s second law τ = I α and in the kinetic-energy term ½ I ω².",
    intuition: "a long thin rod is harder to spin about its center than a compact ball of the same mass. that difference is moment of inertia.",
    why: "every rigid-body dynamic model and every robot inertia matrix is built from moments (and products) of inertia of the links.",
    inWork: "the 2r dynamic model and the gravity-compensation term both need the link masses and the locations of the centers of mass; the rotational inertias enter the full equations of motion.",
    related: ["inertia", "kinetic-energy", "rigid-body-dynamics"]
  },
  {
    id: "kinetic-energy",
    term: "kinetic energy",
    categories: ["dynamics", "math"],
    status: "used",
    level: "foundational",
    short: "the energy associated with motion; ½ m v² for a particle or ½ I ω² for a rigid body rotating about a fixed axis.",
    definition: "in classical mechanics the total kinetic energy T is the sum of translational and rotational contributions of every body. lagrange’s equations are formed from the difference T − V.",
    intuition: "anything that is moving has kinetic energy. when two bodies collide elastically that energy is conserved; when they collide inelastically some of it is lost to heat and deformation.",
    why: "energy methods (lagrange, hamilton) are often the cleanest way to derive the equations of motion for constrained multi-body systems.",
    inWork: "the energy-drift diagnosis in the two-disk simulation and the lagrange derivations for the various dynamics demos all start from explicit expressions for kinetic and potential energy.",
    related: ["potential-energy", "conservation-of-energy", "lagrange"]
  },
  {
    id: "potential-energy",
    term: "potential energy",
    categories: ["dynamics", "math"],
    status: "used",
    level: "foundational",
    short: "the energy associated with configuration; gravitational m g h and elastic ½ k x² are the two most common forms.",
    definition: "potential energy V is a scalar function of position such that the conservative force is minus its gradient. total mechanical energy T + V is conserved when only conservative forces act and no numerical dissipation is present.",
    intuition: "raise a mass or stretch a spring and you store energy that can later be converted back into motion.",
    why: "together with kinetic energy it supplies the lagrangian and therefore the entire equations of motion for conservative systems.",
    inWork: "every spring-coupled and pendulum simulation in the dynamics suite includes gravitational and/or elastic potential terms; energy conservation is used as a diagnostic.",
    related: ["kinetic-energy", "conservation-of-energy", "spring"]
  },
  {
    id: "hookes-law",
    term: "hooke's law",
    categories: ["dynamics", "comp-mech"],
    status: "used",
    level: "foundational",
    short: "the linear force–displacement relation for an ideal spring: F = −k x.",
    definition: "hooke’s law states that the restoring force of a spring is proportional to its extension (or compression) and opposite in direction. the constant of proportionality is the spring stiffness k.",
    intuition: "pull a spring twice as far and it pulls back twice as hard — until you exceed the elastic limit.",
    why: "it is the constitutive law behind every linear spring element in multi-body models and the 1-d analogue of linear elasticity.",
    inWork: "all of the spring-coupled dynamics simulations (disks, blocks, pendulums) use linear hookean springs; the coupling forces are exactly −k Δx.",
    related: ["spring", "spring-constant", "restoring-force", "potential-energy"]
  },
  {
    id: "time-integration",
    term: "time integration",
    categories: ["dynamics", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the numerical process of advancing the state of a dynamic system from one time step to the next.",
    definition: "given ẋ = f(x,t), a time-integration scheme (euler, rk4, newmark, etc.) produces a sequence x₀, x₁, \ldots that approximates the true solution of the ordinary differential equation.",
    intuition: "the continuous equations tell you the velocity and acceleration at every instant. time integration turns those rates into actual positions a small Δt later, over and over.",
    why: "every dynamics simulation is ultimately a time-integration loop. stability, accuracy, and energy behavior are all properties of the chosen scheme and step size.",
    inWork: "the vehicle-dynamics sim uses real-time rk4; the simpler browser demos use fixed-step schemes whose energy drift was carefully monitored and corrected.",
    related: ["time-step", "numerical-stability", "energy-drift", "rk4"]
  },
  {
    id: "linearization",
    term: "linearization",
    categories: ["dynamics", "robot-ctrl", "math"],
    status: "used",
    level: "intermediate",
    short: "the approximation of a nonlinear system by its first-order taylor expansion about an operating point, producing a linear state-space model.",
    definition: "if ẋ = f(x,u), the linearized model about (x₀,u₀) is δẋ = A δx + B δu with A = ∂f/∂x and B = ∂f/∂u evaluated at the operating point.",
    intuition: "most systems are curved, but in a small neighborhood they look flat. linearization replaces the curve by its tangent plane so you can apply linear control theory.",
    why: "eigenvalues, lqr, controllability, and classical stability margins are all defined for linear systems; linearization is how you get those tools to work on nonlinear robots and vehicles.",
    inWork: "the inverted triple-pendulum controller was designed on the linearized model about the upright equilibrium; the open-loop eigenvalues were reported explicitly in the journal.",
    related: ["state-space-model", "eigenvalue", "lqr", "stability"]
  },
  {
    id: "discretization",
    term: "discretization",
    categories: ["num-methods", "comp-mech"],
    status: "used",
    level: "foundational",
    short: "the replacement of a continuous domain or equation by a finite set of algebraic unknowns and equations.",
    definition: "spatial discretization (finite elements, finite volumes, finite differences) turns a pde into a large system of odes or algebraic equations. temporal discretization then turns those odes into a sequence of algebraic solves.",
    intuition: "the real world is continuous. computers only understand finite lists of numbers. discretization is the controlled approximation that turns the continuous problem into something a machine can solve.",
    why: "every numerical method begins with a discretization choice, and that choice dominates both accuracy and computational cost.",
    inWork: "mesh generation in the fea tools is spatial discretization; the fixed time steps in the dynamics demos are temporal discretization.",
    related: ["mesh", "finite-element-method", "discretization-error", "time-integration"]
  },
  {
    id: "condition-number",
    term: "condition number",
    categories: ["num-methods", "comp-mech"],
    status: "studied",
    level: "intermediate",
    short: "a measure of how sensitive the solution of a linear system is to small perturbations in the data or the matrix.",
    definition: "for a matrix A the 2-norm condition number is κ(A) = σ_max / σ_min (ratio of largest to smallest singular value). large κ means the system is ill-conditioned and small relative errors in the input can produce large relative errors in the solution.",
    intuition: "if κ is 10⁶ then you may lose roughly 6 digits of accuracy just from the conditioning, even with perfect arithmetic.",
    why: "mesh distortion, near-incompressibility, and large material contrasts all drive the condition number of the stiffness matrix up and make iterative solvers slower or less accurate.",
    inWork: "the journal notes on mesh quality and on the need for selective refinement are partly motivated by keeping the condition number from exploding.",
    related: ["ill-conditioning", "matrix-conditioning", "iterative-solver", "preconditioning"]
  },
  {
    id: "preconditioning",
    term: "preconditioning",
    categories: ["num-methods", "comp-mech"],
    status: "studied",
    level: "advanced",
    short: "the transformation of a linear system into an equivalent one that is easier for an iterative solver to handle, usually by clustering eigenvalues.",
    definition: "instead of solving Ax = b one solves M⁻¹ A x = M⁻¹ b (left preconditioning) where M is an inexpensive approximation to A. a good preconditioner dramatically reduces the number of iterations required by cg or gmres.",
    intuition: "if the original matrix is badly scaled or has a huge spread of eigenvalues, the iterative solver crawls. multiplying by a cheap approximate inverse makes the effective matrix closer to the identity so convergence speeds up.",
    why: "for large 3-d elasticity problems, preconditioning is often the difference between a solver that finishes in minutes and one that never finishes.",
    inWork: "the pure-js cg solver in the playground is currently un-preconditioned; adding even a simple diagonal or incomplete-factorization preconditioner is a natural next performance step.",
    related: ["conjugate-gradient", "condition-number", "iterative-solver"]
  },
  {
    id: "fillet",
    term: "fillet",
    categories: ["cad-mfg"],
    status: "used",
    level: "foundational",
    short: "a rounded transition between two surfaces or edges, used both for manufacturability and to reduce stress concentration.",
    definition: "a fillet replaces a sharp internal or external corner with a portion of a cylinder or torus of specified radius. in analysis the fillet radius is a critical geometric parameter that controls the local stress peak.",
    intuition: "sharp corners are stress raisers and are also hard to machine or print cleanly. a fillet smooths the corner and spreads the force flow.",
    why: "almost every real mechanical part uses fillets; ignoring them in the cad-to-fea pipeline produces non-conservative stress predictions.",
    inWork: "the crack in the first 2r forearm print initiated at the root fillet. the post-mortem examined both the geometric stress concentration and the layer orientation relative to that fillet.",
    related: ["stress-concentration", "cad", "layer-adhesion"]
  },
  {
    id: "infill",
    term: "infill",
    categories: ["cad-mfg"],
    status: "used",
    level: "foundational",
    short: "the internal structure printed inside the outer walls of an fdm part; expressed as a percentage of solid volume.",
    definition: "infill patterns (grid, gyroid, honeycomb, \ldots) and density control the trade-off between weight, material use, print time, and strength. 100 % infill is effectively solid.",
    intuition: "most of the interior of a printed part is empty or sparsely filled. the infill percentage tells the slicer how much of that interior to actually deposit.",
    why: "structural performance of fdm parts is highly sensitive to infill density and pattern, especially in the presence of anisotropy.",
    inWork: "the failed 2r link was reprinted at 100 % infill with a rotated orientation; the combination of solid interior and better layer direction relative to the principal stress fixed the premature fracture.",
    related: ["fdm", "print-orientation", "layer-adhesion", "anisotropy"]
  },
  {
    id: "print-orientation",
    term: "print orientation",
    categories: ["cad-mfg"],
    status: "used",
    level: "foundational",
    short: "the attitude of a part relative to the build plate; it determines the direction of the weak interlayer planes.",
    definition: "because fdm strength is anisotropic, the orientation of the layers with respect to the principal stress directions has a first-order effect on failure load. orientation also affects support requirements and surface finish.",
    intuition: "if the layers are stacked so that the tensile stress tries to peel them apart, the part is weak. rotate the part so that the same stress runs along the layers and it becomes much stronger.",
    why: "it is one of the few free parameters a designer can change after the geometry is fixed, and it often matters more than the nominal material strength.",
    inWork: "the post-mortem of the cracked forearm link explicitly cites layer orientation as the dominant reason the first print failed far below the isotropic fea prediction.",
    related: ["fdm", "layer-adhesion", "anisotropy", "knockdown-factor"]
  },
  {
    id: "anisotropy",
    term: "anisotropy",
    categories: ["cad-mfg", "comp-mech"],
    status: "used",
    level: "intermediate",
    short: "direction-dependent material properties; the opposite of isotropy.",
    definition: "an anisotropic material has different stiffness or strength values along different material axes. fdm parts are a classic example: the filament direction is strong, the interlayer direction is weak.",
    intuition: "wood is anisotropic (strong along the grain, weak across it). a 3-d printed part is the same idea, with the “grain” set by the print path.",
    why: "isotropic fea of an anisotropic part produces non-conservative safety factors and can completely miss the actual failure mode.",
    inWork: "coupon tests on the same pla and print settings gave ~48 mpa along the filament and only ~18 mpa interlayer. that measured anisotropy is what justified the 0.4 knockdown factor.",
    related: ["fdm", "layer-adhesion", "knockdown-factor", "isotropy"]
  },
  {
    id: "reynolds-number",
    term: "reynolds number",
    categories: ["cfd"],
    status: "studied",
    level: "intermediate",
    short: "the dimensionless ratio of inertial forces to viscous forces in a flow; the primary indicator of laminar versus turbulent regime.",
    definition: "re = ρ v l / μ (or v l / ν). low re → viscous-dominated laminar flow; high re → inertia-dominated flow that can become turbulent.",
    intuition: "a tiny insect flying through air is at low reynolds number (viscosity matters a lot). a large airplane is at high reynolds number (inertia dominates).",
    why: "it is the first quantity you compute when you want to know what kind of flow you are dealing with and whether a given simulation will be stable.",
    inWork: "the lbm cfd solver’s stability limits are directly tied to the reynolds number of the simulated flow; higher re demands finer lattices or more sophisticated collision operators.",
    related: ["lattice-boltzmann-method", "laminar-flow", "turbulent-flow", "navier-stokes-equations"]
  },
  {
    id: "navier-stokes-equations",
    term: "navier-stokes equations",
    categories: ["cfd", "math"],
    status: "studied",
    level: "advanced",
    short: "the fundamental momentum and mass-conservation equations that govern the motion of viscous fluids.",
    definition: "the incompressible navier-stokes equations are ∇·v = 0 and ρ(∂v/∂t + v·∇v) = −∇p + μ∇²v + f. they express conservation of mass and momentum for a newtonian fluid.",
    intuition: "they are newton’s second law written for every tiny fluid particle, plus the statement that fluid doesn’t spontaneously appear or disappear.",
    why: "almost every continuum cfd method is a numerical attack on some form of the navier-stokes equations.",
    inWork: "the lattice-boltzmann solver is an alternative kinetic-route to the same macroscopic physics; the project description explicitly contrasts it with traditional navier-stokes discretizations.",
    related: ["lattice-boltzmann-method", "reynolds-number", "continuity-equation"]
  },
  {
    id: "unit-test",
    term: "unit test",
    categories: ["soft-eng", "eng-method"],
    status: "used",
    level: "foundational",
    short: "a small, automated check that verifies one specific piece of code (a function, a class, a conversion routine) in isolation.",
    definition: "a unit test calls a unit of code with known inputs and asserts that the outputs match expectations. the suite is run automatically so regressions are caught as soon as they are introduced.",
    intuition: "instead of waiting until the whole program is finished and then discovering a bug in a low-level helper, you write a tiny test that would have failed the moment the bug appeared.",
    why: "numerical code is full of off-by-one errors, sign errors, and silent precision problems; unit tests are the cheapest way to keep those from propagating.",
    inWork: "the coo→csr converter has an explicit unit test that builds a 3-element patch and checks the frobenius norm of the difference against a dense reference. that test is what caught the indexing bug.",
    related: ["verification", "patch-test", "regression-test"]
  },
  {
    id: "memory-leak",
    term: "memory leak",
    categories: ["soft-eng", "web-viz"],
    status: "used",
    level: "intermediate",
    short: "the gradual accumulation of memory that is no longer needed but is never released, eventually exhausting the available heap.",
    definition: "in garbage-collected languages a leak usually means that references to large objects are unintentionally kept alive. in manual-memory languages it means malloc/new without a corresponding free/delete.",
    intuition: "you keep asking for more drawers and never put anything back. sooner or later the room is full.",
    why: "long-running simulations and browser tabs are especially vulnerable; a leak that is invisible on a short test becomes a crash after hours or after a few mesh refinements.",
    inWork: "the pure-js fea assembler was creating thousands of temporary typed arrays that the garbage collector could not keep up with; moving the whole path into a worker and reusing buffers removed the effective leak.",
    related: ["heap", "typed-array", "web-worker", "garbage-collection"]
  },
  {
    id: "main-thread",
    term: "main thread",
    categories: ["web-viz", "soft-eng"],
    status: "used",
    level: "foundational",
    short: "the single javascript thread in a browser that is allowed to touch the dom and that must stay responsive to keep the page interactive.",
    definition: "all ui events, layout, painting, and ordinary script execution share the main thread. any long-running computation on it freezes the interface until it finishes.",
    intuition: "the main thread is the only waiter in the restaurant. if it disappears into the kitchen for five seconds to solve a linear system, nobody gets their drinks refilled.",
    why: "browser-based scientific tools are unusable if the main thread is blocked; that is why web workers exist.",
    inWork: "the decision to move stiffness assembly and the cg solve into a web worker was driven entirely by the need to keep the main thread free for rendering and user interaction.",
    related: ["web-worker", "event-loop", "typed-array"]
  },
  {
    id: "transferable-object",
    term: "transferable object",
    categories: ["web-viz", "soft-eng"],
    status: "used",
    level: "intermediate",
    short: "a javascript object (most commonly an arraybuffer) that can be moved from one context to another without copying, by transferring ownership.",
    definition: "when you postmessage an arraybuffer with a transfer list, the original context loses access and the receiving context gains it at essentially zero cost. this avoids the expensive structured-clone copy of large numeric buffers.",
    intuition: "instead of photocopying a 50 mb buffer and then throwing the original away, you just hand the original over.",
    why: "worker-based numerical code would be impractical if every result had to be copied back to the main thread.",
    inWork: "the fea playground transfers the result buffer from the worker with postmessage({ \ldots }, [buffer]) so the main thread can update the visualization without a second allocation.",
    related: ["web-worker", "arraybuffer", "typed-array", "postmessage"]
  },
  {
    id: "problem-definition",
    term: "problem definition",
    categories: ["eng-method"],
    status: "used",
    level: "foundational",
    short: "the clear statement of what is being solved, why it matters, and what success looks like; the first stage of a disciplined engineering workflow.",
    definition: "a good problem definition identifies the stakeholders, the quantitative requirements, the constraints, the assumptions, and the acceptance criteria before any design or analysis begins.",
    intuition: "if you cannot write down what “done” means, you will not know when you have finished and you will not know whether the result is useful.",
    why: "most project failures that look technical are actually failures of problem definition — solving the wrong problem, or solving the right problem with the wrong success metrics.",
    inWork: "the ten-stage workflow described on the site begins with problem definition; every journal entry and project write-up starts from an explicit statement of the question being asked.",
    related: ["requirements", "constraints", "assumptions", "validation"]
  },
  {
    id: "tradeoff",
    term: "tradeoff",
    categories: ["eng-method"],
    status: "used",
    level: "foundational",
    short: "a situation in which improving one performance metric necessarily degrades another; the central reality of engineering design.",
    definition: "a tradeoff exists when the feasible set does not allow simultaneous improvement of all objectives. the designer must then choose a compromise that reflects the relative importance of the competing goals.",
    intuition: "make the part lighter and it usually becomes less stiff or more expensive to manufacture. you cannot have all three at their individual optima.",
    why: "almost every real design decision is a tradeoff. pretending otherwise produces brittle or non-manufacturable results.",
    inWork: "the manufacturing-constraint experiments explicitly accept an ~8 % compliance penalty in exchange for printable minimum member sizes — a classic stiffness-versus-manufacturability tradeoff.",
    related: ["objective-function", "constraint", "design-space", "pareto"]
  },
  {
    id: "root-cause-analysis",
    term: "root cause analysis",
    categories: ["eng-method", "experimental"],
    status: "used",
    level: "intermediate",
    short: "a structured investigation that moves past the immediate symptom to the underlying condition that allowed the failure to occur.",
    definition: "root-cause analysis asks “why did this happen?” repeatedly until the answers are no longer symptoms but systemic or physical causes that can be permanently fixed.",
    intuition: "the part cracked. “bad print” is a symptom. “layer adhesion was only 18 mpa because of orientation and temperature” is closer to a root cause.",
    why: "fixing the symptom once leaves you vulnerable to the same failure on the next part. fixing the root cause improves the whole process.",
    inWork: "the 2r link post-mortem, the energy-drift diagnosis, and the memory-spike investigation are all examples of root-cause analysis recorded in the lab journal.",
    related: ["post-mortem", "failure-analysis", "validation"]
  },
  {
    id: "measurement-uncertainty",
    term: "measurement uncertainty",
    categories: ["experimental"],
    status: "studied",
    level: "intermediate",
    short: "the quantified doubt about the result of a measurement; a property of the measurement process, not of the true value.",
    definition: "uncertainty combines random variability (repeatability) and systematic effects (bias, calibration limits, resolution) into an interval that is believed to contain the true value with a stated confidence.",
    intuition: "the scale says 150.3 g. measurement uncertainty is the honest admission that the real mass is probably somewhere between 149.8 g and 150.8 g.",
    why: "without uncertainty bars, comparing simulation to experiment is meaningless — you cannot tell whether a discrepancy is significant.",
    inWork: "when simulated pid gains were transferred to the physical arm, the residual steady-state error and the overshoot had to be interpreted in light of sensor resolution, friction variability, and the limited number of repeated trials.",
    related: ["measurement-error", "calibration", "experimental-validation", "repeatability"]
  },
  {
    id: "sampling-rate",
    term: "sampling rate",
    categories: ["experimental", "robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the frequency at which a continuous signal is measured and converted into discrete digital samples.",
    definition: "sampling rate f_s determines both the nyquist limit (the highest frequency that can be represented) and the time resolution of any subsequent digital control or analysis.",
    intuition: "if you only look at a swinging pendulum ten times a second you will miss the fast details. look a thousand times a second and the motion looks smooth.",
    why: "control loops, impact detection, and energy calculations all degrade when the sampling rate is too low relative to the dynamics of interest.",
    inWork: "the physical 2r control loop and the camera-based tracking both operate at fixed sampling rates that had to be high enough to keep latency and discretization error acceptable.",
    related: ["time-series", "discrete-system", "nyquist", "real-time"]
  },
  {
    id: "ordinary-differential-equation",
    term: "ordinary differential equation (ode)",
    categories: ["math", "dynamics", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "a differential equation that involves derivatives with respect to only one independent variable, usually time.",
    definition: "an ode relates a function y(t) to its derivatives y′, y″, \ldots. the state-space form ẋ = f(x,t) is a first-order system of odes and is the standard starting point for numerical time integration.",
    intuition: "the laws of motion tell you how the velocity and acceleration depend on the current state. that is an ode. solving it tells you where the system will be later.",
    why: "almost every dynamic simulation is the numerical solution of an ode (or a differential-algebraic equation).",
    inWork: "all of the dynamics demos, the vehicle model, and the linearized pendulum controller are ultimately ode initial-value problems.",
    related: ["time-integration", "state-space-model", "numerical-integration", "initial-condition"]
  },
  {
    id: "partial-differential-equation",
    term: "partial differential equation (pde)",
    categories: ["math", "comp-mech", "cfd"],
    status: "used",
    level: "advanced",
    short: "a differential equation that involves partial derivatives with respect to more than one independent variable (usually space and time).",
    definition: "the heat equation, the wave equation, and the navier-stokes equations are all pdes. finite-element and finite-volume methods are techniques for turning pdes into large systems of algebraic equations or odes.",
    intuition: "an ode describes how a single number changes with time. a pde describes how an entire field (temperature, displacement, velocity) changes with both space and time.",
    why: "continuum mechanics and fluid mechanics are written as pdes; every fea or cfd code is a numerical pde solver.",
    inWork: "the fea tools discretize the elliptic pdes of linear elasticity; the lbm solver is a mesoscopic route to the macroscopic pdes of fluid flow.",
    related: ["finite-element-method", "navier-stokes-equations", "discretization"]
  },
  {
    id: "lagrange-multiplier",
    term: "lagrange multiplier",
    categories: ["math", "topo-opt", "dynamics"],
    status: "used",
    level: "advanced",
    short: "an auxiliary variable introduced to enforce a constraint in an optimization problem or in a constrained mechanical system.",
    definition: "in optimization the stationarity condition ∇f = λ ∇g appears when minimizing f subject to g = 0. in mechanics the same idea produces the constraint forces that keep a system on its constraint manifold.",
    intuition: "the multiplier is the “price” of the constraint. in topology optimization it is the shadow price of material; in rigid-body dynamics it is the magnitude of the contact or joint force.",
    why: "it is the standard mathematical device for turning a constrained problem into an unconstrained one in a higher-dimensional space.",
    inWork: "the oc update in the generative engine is driven by a lagrange multiplier that is adjusted by bisection until the volume constraint is met exactly.",
    related: ["optimality-criteria", "constrained-optimization", "volume-fraction"]
  },
  {
    id: "natural-frequency",
    term: "natural frequency",
    categories: ["dyn-projects", "dynamics", "robot-ctrl"],
    status: "used",
    level: "intermediate",
    short: "the frequency at which a system oscillates when disturbed from equilibrium and then left alone (free vibration).",
    definition: "for a linear multi-dof system the natural frequencies are the square roots of the eigenvalues of the generalized problem Kφ = ω² Mφ. each corresponds to a normal mode shape.",
    intuition: "pluck a guitar string and it rings at its natural frequency. the same idea applies to every spring-mass, pendulum, or flexible structure.",
    why: "resonance occurs when a driving frequency approaches a natural frequency; design and control both need to know where those frequencies lie.",
    inWork: "the harmonic-excitation demos are deliberately run near or through the natural frequencies of the coupled systems so that energy transfer and modal interaction become visible.",
    related: ["resonance", "mode", "eigenvalue", "harmonic-excitation"]
  },
  {
    id: "resonance",
    term: "resonance",
    categories: ["dyn-projects", "dynamics"],
    status: "used",
    level: "intermediate",
    short: "the large-amplitude response that occurs when a system is driven at or near one of its natural frequencies.",
    definition: "for a lightly damped linear system the steady-state amplitude grows dramatically as the driving frequency approaches a natural frequency, limited only by damping and nonlinear effects.",
    intuition: "push a swing at just the right rhythm and the amplitude builds. push at the wrong rhythm and almost nothing happens.",
    why: "resonance can destroy structures or, when controlled, can be used for energy harvesting and vibration testing.",
    inWork: "several of the dynamics simulations are driven at frequencies chosen to illustrate resonant energy transfer between coupled oscillators or between a driven block and attached pendulums.",
    related: ["natural-frequency", "harmonic-excitation", "damping", "mode"]
  },
  {
    id: "mode",
    term: "mode",
    categories: ["dyn-projects", "dynamics"],
    status: "used",
    level: "intermediate",
    short: "a characteristic pattern of motion (mode shape) associated with a particular natural frequency of a linear system.",
    definition: "each eigenpair (ω², φ) of the generalized eigenvalue problem supplies a natural frequency and a corresponding mode shape. any free response can be written as a linear combination of these modes.",
    intuition: "a guitar string has a fundamental mode (the whole string moving together) and higher modes (with nodes). complex structures have many such patterns, each with its own frequency.",
    why: "modal analysis reduces a large multi-dof system to a set of independent single-dof oscillators and is the foundation of most practical vibration engineering.",
    inWork: "the coupled-pendulum and multi-block simulations are examined in terms of how energy moves between the different modal coordinates when the system is driven near resonance.",
    related: ["natural-frequency", "eigenmode", "resonance", "eigenvalue"]
  },
  {
    id: "multibody-dynamics",
    term: "multibody dynamics",
    categories: ["dyn-projects", "dynamics", "robot-kin"],
    status: "used",
    level: "advanced",
    short: "the branch of mechanics that studies systems of rigid or flexible bodies connected by joints and force elements.",
    definition: "multibody formulations systematically assemble the equations of motion for systems with many interconnected parts, handling constraints (holonomic or non-holonomic) via lagrange multipliers, coordinate partitioning, or recursive algorithms.",
    intuition: "a single rigid body is easy. a collection of bodies linked by hinges, sliders, springs, and contacts is a multibody system — cars, robots, mechanisms, and the dynamics demos on the site are all examples.",
    why: "once the number of bodies and constraints grows, ad-hoc newton-euler or lagrange derivations become unmanageable; a systematic multibody approach is required.",
    inWork: "the vehicle-dynamics sim is a 14-dof multibody model; the various ds* simulations are smaller multibody systems chosen to isolate particular constraint or contact phenomena.",
    related: ["rigid-body-dynamics", "constraint", "lagrange-multiplier", "kinematic-chain"]
  },
  {
    id: "mesh-density",
    term: "mesh density",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "foundational",
    short: "a measure of how finely a domain is discretized — typically expressed as element size or number of elements per unit length.",
    definition: "mesh density controls the spatial resolution of a finite-element model. higher density reduces discretization error but increases the number of degrees of freedom and therefore the computational cost.",
    intuition: "a coarse mesh is like a low-resolution photo — you see the overall shape but miss the fine details. a dense mesh captures stress concentrations and curved boundaries more accurately.",
    why: "choosing the right mesh density is a constant trade-off between accuracy and runtime; it is the first thing checked in any convergence study.",
    inWork: "the journal repeatedly records mesh-density experiments on the 2r links and on the cantilever benchmarks; memory limits forced selective refinement rather than uniform density increases.",
    related: ["mesh", "mesh-refinement", "mesh-convergence", "discretization-error"]
  },
  {
    id: "mesh-refinement",
    term: "mesh refinement",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the process of locally or globally reducing element size to improve solution accuracy in critical regions.",
    definition: "mesh refinement can be uniform (h-refinement everywhere) or adaptive (concentrated near stress concentrations, singularities, or high-gradient zones). the goal is to drive discretization error below a chosen tolerance.",
    intuition: "you keep the mesh coarse where the solution is smooth and only add elements where the stress is changing rapidly or where you need higher accuracy.",
    why: "uniform refinement is expensive; intelligent refinement delivers the same accuracy with far fewer degrees of freedom.",
    inWork: "the aborted full-refinement study on the 2r shoulder was replaced by selective fillet refinement precisely to stay under memory limits while still capturing the stress peak.",
    related: ["mesh-density", "mesh-convergence", "stress-concentration", "element-quality"]
  },
  {
    id: "mesh-distortion",
    term: "mesh distortion",
    categories: ["comp-mech"],
    status: "used",
    level: "intermediate",
    short: "the deviation of element shapes from ideal (equilateral, rectangular, etc.) that degrades accuracy and can cause solver failure.",
    definition: "distortion is quantified by metrics such as jacobian determinant, aspect ratio, skewness, and minimum angle. severely distorted elements produce inaccurate stiffness matrices and can make the global system ill-conditioned.",
    intuition: "a long, skinny triangle or a nearly collapsed tetrahedron does not approximate the continuum well; the shape functions become poorly conditioned.",
    why: "automatic meshers can generate distorted elements near complex geometry; those elements silently destroy solution quality if not filtered out.",
    inWork: "the journal notes that intermediate density fields in topology optimization can produce highly skewed elements near the solid-void boundary, making stress recovery unreliable until the mesh is cleaned or remeshed.",
    related: ["element-quality", "jacobian", "mesh-refinement"]
  },
  {
    id: "element-quality",
    term: "element quality",
    categories: ["comp-mech"],
    status: "used",
    level: "intermediate",
    short: "a set of geometric metrics that describe how well-shaped an element is for numerical analysis.",
    definition: "common quality measures include aspect ratio, jacobian ratio, minimum dihedral angle, and scaled jacobian. elements falling below a threshold are flagged for refinement or remeshing.",
    intuition: "good elements look “nice” — roughly equilateral triangles or well-proportioned hexahedra. bad elements look crushed or stretched and produce bad numbers.",
    why: "solver accuracy and robustness depend heavily on element quality; a few bad elements can pollute an otherwise excellent mesh.",
    inWork: "quality checks appear in the topology-optimization pipeline when the density field is converted to a boundary representation; poor-quality elements near the isosurface are a known source of stress artifacts.",
    related: ["mesh-distortion", "mesh", "isosurface"]
  },
  {
    id: "force-vector",
    term: "force vector",
    categories: ["comp-mech"],
    status: "used",
    level: "foundational",
    short: "the right-hand side of the discrete equilibrium equation Ku = f; it contains all applied nodal forces and equivalent loads.",
    definition: "after assembly the global force vector f collects point loads, distributed-load contributions (via shape-function integrals), and reaction forces at constrained degrees of freedom.",
    intuition: "every external push or pull on the structure ends up as a number in f. the solver then finds the displacements u that balance those forces through the stiffness matrix.",
    why: "incorrect force assembly is a common source of “the structure moves the wrong way” bugs.",
    inWork: "both the playground and the generative engine build f from user-specified point loads and pressure boundaries before solving Ku = f.",
    related: ["stiffness-matrix", "displacement-vector", "neumann-boundary-condition"]
  },
  {
    id: "displacement-vector",
    term: "displacement vector",
    categories: ["comp-mech"],
    status: "used",
    level: "foundational",
    short: "the vector of unknown nodal displacements (and rotations) that the linear solver computes from Ku = f.",
    definition: "u contains one entry for every free degree of freedom. after the solve, post-processing recovers stresses and strains from the element-level displacement gradients.",
    intuition: "u is the answer the finite-element program exists to find — how much each node moves under the applied loads.",
    why: "all derived quantities (stress, strain, reaction forces, compliance) are computed from u.",
    inWork: "compliance is evaluated as uᵀKu (or fᵀu); every topology-optimization iteration therefore requires a fresh displacement solve.",
    related: ["stiffness-matrix", "force-vector", "compliance", "degrees-of-freedom"]
  },
  {
    id: "global-stiffness-matrix",
    term: "global stiffness matrix",
    categories: ["comp-mech", "num-methods"],
    status: "used",
    level: "intermediate",
    short: "the sparse matrix K that relates all free nodal displacements to the corresponding nodal forces for the entire mesh.",
    definition: "K is obtained by assembling every element stiffness matrix into a single system-level matrix. after application of boundary conditions it is symmetric positive-definite for stable linear-elastic problems.",
    intuition: "each element contributes a small dense block; assembly scatters those blocks into the correct global rows and columns, producing one large sparse matrix that describes the whole structure.",
    why: "forming and solving K is the computational core of linear static finite-element analysis.",
    inWork: "the generative engine and the playground both spend the majority of their runtime on global stiffness assembly and the subsequent sparse solve.",
    related: ["stiffness-matrix", "element-assembly", "sparse-matrix", "degrees-of-freedom"]
  },
  {
    id: "local-stiffness-matrix",
    term: "local stiffness matrix",
    categories: ["comp-mech"],
    status: "used",
    level: "intermediate",
    short: "the small dense matrix that relates the nodal displacements of a single element to the nodal forces acting on that element.",
    definition: "for each element the local matrix k^e is computed from the material constitutive law, the element geometry, and the shape-function derivatives. it is later assembled into the global K.",
    intuition: "before the whole structure is considered, each little triangle or tetrahedron has its own miniature stiffness matrix that knows only about its own nodes.",
    why: "correct local matrices are a prerequisite for a correct global system; most element-level bugs appear here.",
    inWork: "the pure-js and c++ assemblers first form local matrices for every element, then scatter them; the patch-test unit test verifies that this step is accurate.",
    related: ["stiffness-matrix", "element-assembly", "shape-function"]
  },
  {
    id: "linear-elasticity",
    term: "linear elasticity",
    categories: ["comp-mech"],
    status: "used",
    level: "foundational",
    short: "the constitutive theory in which stress is a linear function of strain and deformations are assumed small.",
    definition: "under linear elasticity the stress–strain relation is σ = C : ε (hooke’s law in tensor form) and the strain–displacement relation is linearized. the resulting weak form yields a symmetric positive-definite stiffness matrix.",
    intuition: "if you double the load, the displacement doubles and the stress doubles; there is no geometric nonlinearity and no material nonlinearity.",
    why: "it is the default assumption for the great majority of structural finite-element analyses and for almost all density-based topology optimization.",
    inWork: "both the fea playground and the generative cto engine are built entirely on linear-elastic theory; the simp interpolation acts on the young’s modulus of that linear material.",
    related: ["youngs-modulus", "poisson-ratio", "constitutive-model", "stiffness-matrix"]
  },
  {
    id: "constitutive-model",
    term: "constitutive model",
    categories: ["comp-mech"],
    status: "used",
    level: "intermediate",
    short: "the mathematical relation that links stress to strain (or strain rate) for a given material.",
    definition: "a constitutive model can be as simple as isotropic linear elasticity or as complex as anisotropic plasticity, hyperelasticity, or viscoelasticity. it supplies the material tangent that enters the element stiffness matrix.",
    intuition: "the constitutive model is the “personality” of the material — how hard it pushes back when you stretch or shear it.",
    why: "choosing an inappropriate constitutive model is one of the fastest ways to obtain numerically correct but physically meaningless results.",
    inWork: "the current tools use isotropic linear elasticity; the fdm knockdown work is a pragmatic way of adjusting that model to account for observed interlayer weakness.",
    related: ["linear-elasticity", "youngs-modulus", "material-model", "anisotropy"]
  },
  {
    id: "non-design-region",
    term: "non-design region",
    categories: ["topo-opt"],
    status: "used",
    level: "foundational",
    short: "a portion of the mesh that is excluded from the optimization and is forced to remain either solid or void.",
    definition: "non-design solid regions typically represent supports, load pads, or bolt holes that must stay fully dense. non-design void regions represent keep-out zones. the optimizer is free to change density only inside the complementary design domain.",
    intuition: "you tell the algorithm “these parts of the geometry are already decided — do not touch them.”",
    why: "real parts almost always contain regions that cannot be redesigned; without non-design regions the optimizer would freely remove material from supports or load introduction points.",
    inWork: "the cantilever benchmarks in the generative engine fix the left-hand support strip and the load-application patch as non-design solid.",
    related: ["design-domain", "topology-optimization", "volume-fraction"]
  },
  {
    id: "objective-function",
    term: "objective function",
    categories: ["topo-opt", "math", "eng-method"],
    status: "used",
    level: "foundational",
    short: "the scalar quantity that an optimizer is asked to minimize or maximize.",
    definition: "in topology optimization the most common objective is compliance (equivalent to maximizing stiffness). other objectives include mass, stress, eigenvalue, or multi-objective combinations.",
    intuition: "the objective is the score the algorithm is trying to improve. everything else (constraints, filters, projections) exists to keep that score meaningful and manufacturable.",
    why: "a poorly chosen objective produces designs that are mathematically optimal but useless for the real engineering goal.",
    inWork: "the generative cto engine minimizes compliance subject to a volume-fraction constraint; every journal entry that tracks “objective improved” is referring to this function.",
    related: ["compliance", "constraint", "topology-optimization", "gradient"]
  },
  {
    id: "constraint",
    term: "constraint",
    categories: ["topo-opt", "math", "eng-method"],
    status: "used",
    level: "foundational",
    short: "a restriction that the optimizer is not allowed to violate while improving the objective.",
    definition: "constraints may be equality or inequality conditions on volume, mass, stress, displacement, eigenvalue, or manufacturing limits. they are enforced by lagrange multipliers, penalty methods, or projection techniques.",
    intuition: "the objective says “make it as stiff as possible”; the volume constraint says “but you only get 30 % of the material.” the optimizer has to satisfy both.",
    why: "without constraints the optimizer simply fills the entire domain with solid material; constraints are what force interesting trade-offs.",
    inWork: "volume fraction is the primary constraint in the generative engine; manufacturing constraints (minimum member size) were added later as additional restrictions.",
    related: ["volume-fraction", "objective-function", "lagrange-multiplier", "optimality-criteria"]
  },
  {
    id: "sensitivity-analysis",
    term: "sensitivity analysis",
    categories: ["topo-opt", "num-methods"],
    status: "used",
    level: "advanced",
    short: "the computation of derivatives of the objective and constraints with respect to the design variables.",
    definition: "in density-based topology optimization the sensitivities ∂C/∂ρ and ∂V/∂ρ are required by any gradient-based update scheme. they are most efficiently obtained by the adjoint method.",
    intuition: "sensitivity analysis answers “if i add a tiny bit of material here, how much does the compliance change?” that information tells the optimizer where material is most useful.",
    why: "without accurate sensitivities a gradient-based optimizer cannot decide which elements should become denser or thinner.",
    inWork: "the generative engine computes compliance sensitivities with the adjoint method; the journal notes that each volume step required 42–48 oc iterations driven by those sensitivities.",
    related: ["adjoint-method", "gradient", "optimality-criteria", "compliance"]
  },
  {
    id: "adjoint-sensitivity",
    term: "adjoint sensitivity",
    categories: ["topo-opt", "num-methods"],
    status: "used",
    level: "advanced",
    short: "the particular sensitivity field obtained by solving the adjoint equation; it yields all design derivatives at the cost of one additional linear solve.",
    definition: "after the forward displacement solve Ku = f, the adjoint equation Kᵀλ = ∂C/∂u is solved once. the sensitivity of compliance with respect to every density is then a cheap post-processing step involving λ and the element stiffness derivatives.",
    intuition: "instead of perturbing each design variable and re-solving (which would be thousands of solves), you solve one extra system and get every sensitivity for free.",
    why: "it is the reason large-scale topology optimization is computationally feasible.",
    inWork: "the journal explicitly states that the sensitivity field was computed with the adjoint method; that field then drives the oc density updates.",
    related: ["adjoint-method", "sensitivity-analysis", "compliance"]
  },
  {
    id: "intermediate-density",
    term: "intermediate density",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "any density value strictly between 0 and 1; the gray material that penalization and projection try to eliminate.",
    definition: "in the continuous density formulation intermediate densities are mathematically allowed. they are undesirable because they do not correspond to a manufacturable solid or void state and because they can artificially improve the objective.",
    intuition: "gray cells are the optimizer’s way of hedging — half material, half empty. penalization makes that hedge expensive so the algorithm is forced to choose black or white.",
    why: "a final design full of intermediate densities cannot be printed or machined without additional interpretation steps that may destroy optimality.",
    inWork: "the journal repeatedly records residual gray at modest filter radii and the subsequent push toward higher projection β to force a cleaner 0-1 field.",
    related: ["simp", "penalization", "heaviside-projection", "gray-scale"]
  },
  {
    id: "gray-scale",
    term: "gray scale",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "the presence of large regions of intermediate density in a topology-optimized result; an indication that penalization or projection is insufficient.",
    definition: "gray-scale (or grayscale) designs contain extensive areas where 0 < ρ < 1. they are usually the result of low penalization exponents or the absence of a heaviside projection.",
    intuition: "the density plot looks like a fuzzy photograph instead of a crisp black-and-white drawing.",
    why: "gray-scale designs are difficult to interpret for manufacturing and often indicate that the optimizer has not been sufficiently pushed toward discrete solutions.",
    inWork: "early volume-fraction sweeps produced noticeable gray; later runs increased the projection parameter specifically to reduce it.",
    related: ["intermediate-density", "penalization", "heaviside-projection"]
  },
  {
    id: "filter-radius",
    term: "filter radius",
    categories: ["topo-opt"],
    status: "used",
    level: "intermediate",
    short: "the characteristic length scale of the density or sensitivity filter; it controls both checkerboard suppression and minimum member size.",
    definition: "the filter radius r_min defines the neighborhood over which densities (or sensitivities) are averaged. larger radii produce thicker members and stronger regularization at the cost of a higher compliance.",
    intuition: "think of it as the size of the “blur brush” the optimizer is forced to use. a bigger brush cannot draw thin lines.",
    why: "it is the single most important numerical parameter for obtaining manufacturable topology-optimized designs.",
    inWork: "the journal treats filter radius as a primary experimental variable; values around 1.5 elements appear frequently, and manufacturing studies set the closing radius relative to the intended minimum member width.",
    related: ["density-filter", "minimum-member-size", "checkerboarding", "length-scale-control"]
  },
  {
    id: "length-scale-control",
    term: "length-scale control",
    categories: ["topo-opt", "cad-mfg"],
    status: "used",
    level: "advanced",
    short: "any technique that enforces a minimum (or maximum) geometric feature size on the optimized design.",
    definition: "length-scale control can be realized by density filters, morphological operations, projection schemes with multiple phases, or explicit geometric constraints. the goal is to keep the design inside the capabilities of the intended manufacturing process.",
    intuition: "you tell the optimizer “no feature thinner than x millimeters is allowed.” the algorithm then has to find the best design that respects that rule.",
    why: "without it the optimizer freely generates needle-thin struts that look optimal on screen and fail in the real world.",
    inWork: "the morphological-closing experiments and the filter-radius studies are both forms of length-scale control aimed at printable members.",
    related: ["minimum-member-size", "density-filter", "filter-radius", "design-for-manufacturability"]
  },
  {
    id: "morphological-closing",
    term: "morphological closing",
    categories: ["topo-opt", "cad-mfg"],
    status: "used",
    level: "advanced",
    short: "a combination of dilation followed by erosion that removes small holes and thin gaps while roughly preserving overall shape.",
    definition: "in the density field, closing is implemented by a max-filter (dilation) followed by a min-filter (erosion) with a structuring element of chosen radius. it is a common way to impose a minimum length scale on the solid phase.",
    intuition: "closing fills in the small voids and cracks that are thinner than the chosen radius, producing a more robust, printable solid region.",
    why: "it is a simple, differentiable (or approximately differentiable) way to add manufacturing constraints on top of a standard density filter.",
    inWork: "the journal records a manufacturing-constraint run that applied morphological closing at 1.2× the target minimum member width and accepted the resulting compliance increase.",
    related: ["length-scale-control", "minimum-member-size", "density-filter"]
  },
  {
    id: "isosurface",
    term: "isosurface",
    categories: ["topo-opt", "web-viz", "cad-mfg"],
    status: "used",
    level: "intermediate",
    short: "the surface of constant density (commonly ρ = 0.5) extracted from a topology-optimized density field to produce a crisp solid-void boundary.",
    definition: "after optimization the continuous density field is converted to a boundary representation by extracting the isosurface at a chosen threshold. marching cubes or related algorithms are the usual extraction methods.",
    intuition: "you pick a density value and draw the surface where the field equals that value; everything above becomes solid, everything below becomes void.",
    why: "the raw density field is not directly manufacturable; the isosurface is the first step toward a cad-ready solid model.",
    inWork: "the generative engine’s geometry-export path extracts an isosurface; the journal notes that residual gray and shallow density gradients produce noisy surfaces that need additional smoothing.",
    related: ["marching-cubes", "density-field", "geometry-reconstruction", "level-set"]
  },
  {
    id: "marching-cubes",
    term: "marching cubes",
    categories: ["topo-opt", "web-viz", "cad-mfg"],
    status: "studied",
    level: "intermediate",
    short: "a classic algorithm that extracts a triangular mesh isosurface from a 3-d scalar field by processing the field one voxel at a time.",
    definition: "marching cubes examines the eight corners of each cube in a regular grid, determines which edges the isosurface intersects, and emits one or more triangles according to a pre-computed lookup table.",
    intuition: "it walks through the volume looking for places where the density crosses the threshold and stitches those crossings into a surface mesh.",
    why: "it is the standard, robust method for turning a density field into a watertight boundary representation.",
    inWork: "the geometry-export pipeline of the generative engine relies on isosurface extraction; marching-cubes-style methods are the natural candidate for that step.",
    related: ["isosurface", "density-field", "geometry-reconstruction"]
  },
  {
    id: "joint-space",
    term: "joint space",
    categories: ["robot-kin"],
    status: "used",
    level: "foundational",
    short: "the coordinate space whose axes are the robot’s joint variables; the natural space for actuator commands.",
    definition: "a point in joint space is a complete set of joint angles (or displacements). trajectories planned in joint space automatically respect joint limits and avoid the need for continuous inverse kinematics.",
    intuition: "instead of saying “move the tip to (x,y,z)” you say “set joint 1 to 30°, joint 2 to –15°.” that is joint-space control.",
    why: "actuators live in joint space; any cartesian command ultimately has to be converted into joint-space motion.",
    inWork: "the 2r analytical ik returns solutions in joint space; the subsequent pid loops also operate on joint angles.",
    related: ["configuration-space", "task-space", "inverse-kinematics", "forward-kinematics"]
  },
  {
    id: "task-space",
    term: "task space",
    categories: ["robot-kin"],
    status: "used",
    level: "foundational",
    short: "the space in which the robot’s task is naturally specified — usually cartesian position and orientation of the end effector.",
    definition: "task space (or operational space) is the coordinate system of the job itself. inverse kinematics and the jacobian exist to translate task-space goals into joint-space commands.",
    intuition: "the user thinks “put the paddle here”; the robot thinks in joint angles. task space is the user’s language.",
    why: "almost every real application is specified in task space, so the mapping to and from joint space is unavoidable.",
    inWork: "the 2r paddle’s target positions are given in cartesian (task) space; the analytical ik and the jacobian both operate on that mapping.",
    related: ["joint-space", "end-effector", "inverse-kinematics", "jacobian"]
  },
  {
    id: "reachable-workspace",
    term: "reachable workspace",
    categories: ["robot-kin"],
    status: "used",
    level: "foundational",
    short: "the set of all cartesian points that at least one joint configuration can place the end effector at.",
    definition: "for a 2r planar arm the reachable workspace is the closed annulus between |L₁ – L₂| and L₁ + L₂. points outside this region have no real inverse-kinematics solution.",
    intuition: "if you cannot touch a point with any combination of joint angles, that point is outside the reachable workspace.",
    why: "task locations must be chosen inside the reachable workspace; near the boundary the inverse-kinematics problem becomes ill-conditioned.",
    inWork: "the singularity and hysteresis work on the 2r arm was driven by targets that approached the outer boundary of the reachable workspace.",
    related: ["workspace", "inverse-kinematics", "singularity"]
  },
  {
    id: "elbow-up-configuration",
    term: "elbow-up configuration",
    categories: ["robot-kin"],
    status: "used",
    level: "intermediate",
    short: "one of the two inverse-kinematics solutions for a 2r planar arm in which the elbow joint points “upward” relative to the line from base to tip.",
    definition: "for most points inside the reachable workspace a 2r arm has two real solutions that differ by the sign of the elbow angle. the elbow-up solution is the one with the positive (or conventionally “up”) elbow angle.",
    intuition: "you can reach the same point with the arm folded one way or the other; elbow-up is one of those two postures.",
    why: "continuous trajectories must stay on one configuration branch; switching mid-motion produces a sudden jump in joint angles.",
    inWork: "the journal describes the analytical solver flipping between elbow-up and elbow-down near the workspace boundary; hysteresis was added to keep the chosen branch stable.",
    related: ["elbow-down-configuration", "inverse-kinematics", "configuration-space", "hysteresis"]
  },
  {
    id: "elbow-down-configuration",
    term: "elbow-down configuration",
    categories: ["robot-kin"],
    status: "used",
    level: "intermediate",
    short: "the second inverse-kinematics solution for a 2r planar arm in which the elbow joint points “downward” relative to the line from base to tip.",
    definition: "the elbow-down solution is the configuration-space neighbor of the elbow-up solution; both map to the same end-effector position but have different joint-angle sets.",
    intuition: "same tip location, opposite elbow fold.",
    why: "the existence of two branches is the source of the configuration-switching problem that required hysteresis and later damped least-squares on the 2r arm.",
    inWork: "near the outer reach circle the solver oscillated between elbow-up and elbow-down until a soft barrier and hysteresis term locked it onto one branch.",
    related: ["elbow-up-configuration", "inverse-kinematics", "hysteresis", "singularity"]
  },
  {
    id: "hysteresis",
    term: "hysteresis",
    categories: ["robot-kin", "robot-ctrl"],
    status: "used",
    level: "intermediate",
    short: "a deliberate lag or dead-band introduced so that a decision (e.g. which configuration branch to stay on) does not chatter when the input hovers near a threshold.",
    definition: "in the 2r inverse-kinematics context, hysteresis keeps the last valid elbow configuration until the target has moved a finite distance back inside the workspace, preventing rapid switching.",
    intuition: "once you choose a side, you stay on that side until there is a clear reason to switch; small noise or boundary proximity is ignored.",
    why: "without it a numerical solver can oscillate between two equally valid solutions and produce discontinuous joint commands.",
    inWork: "the 2026-07-28 journal entry records the addition of a soft barrier plus hysteresis to stop the elbow-flip chatter near the workspace boundary.",
    related: ["elbow-up-configuration", "elbow-down-configuration", "singularity", "inverse-kinematics"]
  },
  {
    id: "damping-factor",
    term: "damping factor",
    categories: ["robot-kin", "num-methods"],
    status: "used",
    level: "advanced",
    short: "the scalar λ that appears in the damped-least-squares inverse; it trades cartesian tracking accuracy for joint-space smoothness near singularities.",
    definition: "in the formula Δq = Jᵀ(JJᵀ + λ²I)⁻¹ Δx the damping factor λ prevents the inverse from blowing up when the smallest singular value of J approaches zero. larger λ gives more stable but less accurate cartesian motion.",
    intuition: "λ is a “safety knob.” turn it up and the arm refuses to make extreme joint moves even if the tip error is not driven all the way to zero.",
    why: "it is the practical parameter that makes singularity-robust inverse kinematics usable on real hardware.",
    inWork: "after the 2r analytical solver became unstable near the boundary, damped least-squares with λ = 0.02 was introduced; cartesian residual stayed under 0.4 mm.",
    related: ["damped-least-squares", "jacobian", "singularity", "pseudoinverse"]
  },
  {
    id: "rise-time",
    term: "rise time",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the time required for the system response to climb from a low percentage (commonly 10 %) to a high percentage (commonly 90 %) of its final value.",
    definition: "rise time is a standard transient-response metric. shorter rise time implies a more aggressive controller but often correlates with larger overshoot.",
    intuition: "how quickly the arm gets most of the way to the target after a step command.",
    why: "it quantifies the speed of the closed-loop system and is one of the first numbers examined when tuning pid gains.",
    inWork: "the 2r step-response tests recorded both rise time and settling time after each gain change; the final retune balanced the two against overshoot.",
    related: ["settling-time", "overshoot", "pid-controller", "step-response"]
  },
  {
    id: "step-response",
    term: "step response",
    categories: ["robot-ctrl"],
    status: "used",
    level: "foundational",
    short: "the time history of a system’s output when the reference is suddenly changed from one constant value to another.",
    definition: "a step input is the classic test signal for characterizing rise time, overshoot, settling time, and steady-state error of a feedback loop.",
    intuition: "you tell the arm “go to 45° right now” and watch how it gets there — the resulting curve is the step response.",
    why: "it is the simplest, most informative experiment for validating a controller on both simulation and hardware.",
    inWork: "the journal entry on the physical 2r arm reports the step response of joint 1 (0 → 45°) after the derivative-gain increase: 0.38 s settling with 9 % overshoot.",
    related: ["rise-time", "settling-time", "overshoot", "pid-controller"]
  },
  {
    id: "integral-windup",
    term: "integral windup",
    categories: ["robot-ctrl"],
    status: "studied",
    level: "intermediate",
    short: "the continued accumulation of the integral term while the actuator is saturated, leading to large overshoot once the saturation ends.",
    definition: "when the control signal hits a hard limit the plant cannot respond, yet a pure integral term keeps integrating the error. the resulting “wound-up” state produces an aggressive overshoot when the error finally changes sign.",
    intuition: "the controller keeps shouting louder and louder even though the motor is already at full power; when the target is finally reached the shouting takes a long time to quiet down.",
    why: "any real actuator has limits; without anti-windup logic a pid loop can perform poorly or become unstable under large set-point changes.",
    inWork: "the 2r control code includes basic awareness of actuator limits; integral windup is one of the classic issues that had to be considered when moving from simulation to hardware.",
    related: ["integral-gain", "pid-controller", "overshoot", "actuator"]
  },
  {
    id: "damping-ratio",
    term: "damping ratio",
    categories: ["robot-ctrl", "dynamics"],
    status: "used",
    level: "intermediate",
    short: "a dimensionless measure of how oscillations in a second-order system decay; ζ = 1 is critically damped.",
    definition: "for the prototype second-order system s² + 2ζωₙs + ωₙ² the damping ratio ζ determines whether the response is over-damped (ζ > 1), critically damped (ζ = 1), or under-damped (ζ < 1) with oscillatory overshoot.",
    intuition: "low damping ratio means the arm rings like a bell; high damping ratio means it creeps to the target without overshoot.",
    why: "it is the single parameter that most directly predicts overshoot and settling behavior for systems that can be approximated as second-order.",
    inWork: "pid tuning on the 2r joints is effectively an attempt to place the closed-loop damping ratio in a desirable range (typically 0.6–0.8 for a modest overshoot).",
    related: ["damping", "overshoot", "settling-time", "natural-frequency"]
  },
  {
    id: "spring-constant",
    term: "spring constant",
    categories: ["dynamics"],
    status: "used",
    level: "foundational",
    short: "the stiffness k that appears in hooke’s law F = –kx; force per unit extension.",
    definition: "the spring constant has units of force per length. in multi-body models it sets the natural frequency of any spring-mass subsystem (ω = √(k/m) for a simple oscillator).",
    intuition: "a large spring constant means a stiff spring that barely moves under load; a small constant means a soft spring that stretches easily.",
    why: "it is the primary parameter that controls both the static deflection and the oscillatory behavior of every spring-coupled system on the site.",
    inWork: "all of the ds* simulations that contain springs treat k as an explicit, user-tunable parameter that shapes the energy exchange between bodies.",
    related: ["hookes-law", "spring", "natural-frequency", "potential-energy"]
  },
  {
    id: "restoring-force",
    term: "restoring force",
    categories: ["dynamics"],
    status: "used",
    level: "foundational",
    short: "a force that always acts to return a system toward a stable equilibrium configuration.",
    definition: "for a linear spring the restoring force is –kx. more generally any force derived from a potential that has a local minimum produces restoring behavior near that minimum.",
    intuition: "pull a pendulum aside and gravity pulls it back; stretch a spring and it pulls back. those are restoring forces.",
    why: "restoring forces are what create the potential wells whose curvature determines natural frequencies and stability.",
    inWork: "every spring and every pendulum in the dynamics suite generates restoring forces that are central to the observed oscillation and energy-transfer behavior.",
    related: ["hookes-law", "spring", "potential-energy", "equilibrium"]
  },
  {
    id: "coefficient-of-restitution",
    term: "coefficient of restitution",
    categories: ["dynamics", "dyn-projects"],
    status: "used",
    level: "intermediate",
    short: "the ratio of relative speed after a collision to relative speed before the collision, measured along the contact normal.",
    definition: "e = (relative velocity of separation) / (relative velocity of approach). e = 1 is perfectly elastic; e = 0 is perfectly plastic. it is the simplest phenomenological model of impact energy loss.",
    intuition: "drop a super-ball and it bounces almost as high as it fell (e ≈ 1). drop a lump of clay and it sticks (e ≈ 0).",
    why: "rigid-body impact models need a way to set the post-impact normal velocity; the coefficient of restitution is the standard one-parameter choice.",
    inWork: "the two-disk bouncing-plate simulation (ds1) was formulated with e = 1; an energy-drift bug was later traced to an inconsistent impact map and corrected by switching to a velocity-level constraint that respected the same e.",
    related: ["elastic-collision", "contact-impulse", "energy-drift", "velocity-level-constraint"]
  },
  {
    id: "contact-impulse",
    term: "contact impulse",
    categories: ["dynamics", "dyn-projects"],
    status: "used",
    level: "advanced",
    short: "the instantaneous change in momentum delivered across a contact during an impact event.",
    definition: "an impulse J satisfies Δp = J and is related to the coefficient of restitution by a linear complementarity or algebraic condition on the relative normal velocity. it is the rigid-body idealization of a very large force acting for a very short time.",
    intuition: "instead of resolving the tiny deformation and huge contact force of a real impact, you simply jump the velocities by an impulse that produces the desired post-impact motion.",
    why: "event-driven rigid-body engines and many educational simulations rely on impulsive contacts rather than penalty or constraint-stabilization methods.",
    inWork: "the energy-drift fix in the two-disk simulation replaced a position-level penetration correction with a proper velocity-level impulse that conserved energy for e = 1.",
    related: ["coefficient-of-restitution", "elastic-collision", "velocity-level-constraint", "energy-drift"]
  },
  {
    id: "velocity-level-constraint",
    term: "velocity-level constraint",
    categories: ["dynamics", "num-methods"],
    status: "used",
    level: "advanced",
    short: "a constraint expressed on the relative velocities of contacting bodies rather than on their positions; the preferred form for energy-consistent impact resolution.",
    definition: "instead of requiring that penetration depth be zero (position level), a velocity-level constraint requires that the normal component of relative velocity satisfy the restitution law. this avoids the artificial energy injection that position-level corrections can produce.",
    intuition: "you do not try to push the bodies apart after they have already overlapped; you simply set their separation speed to the correct post-impact value.",
    why: "position-level corrections are easy to write but often violate energy conservation; velocity-level formulations are more faithful to the underlying rigid-body impact map.",
    inWork: "the 2026-06-18 journal entry documents the switch from a position-level penetration correction to a velocity-level non-penetration constraint, after which energy drift dropped below 0.05 %.",
    related: ["contact-impulse", "coefficient-of-restitution", "energy-drift", "non-penetration-constraint"]
  },
  {
    id: "time-step",
    term: "time step",
    categories: ["dynamics", "num-methods"],
    status: "used",
    level: "foundational",
    short: "the discrete interval Δt by which a numerical integrator advances the state of a dynamic system.",
    definition: "smaller time steps generally improve accuracy and stability at the cost of more computational work. the largest stable step is limited by the highest natural frequency present in the model and by the chosen integration scheme.",
    intuition: "the integrator takes a series of small snapshots; if the snapshots are too far apart it misses important motion and can become unstable.",
    why: "step size is the primary trade-off between fidelity and speed in every fixed-step dynamics simulation.",
    inWork: "the vehicle-dynamics sim targets real-time performance with a 1 ms step; the browser demos use larger steps whose energy behavior was carefully monitored.",
    related: ["time-integration", "numerical-stability", "energy-drift"]
  },
  {
    id: "numerical-stability",
    term: "numerical stability",
    categories: ["num-methods", "dynamics"],
    status: "used",
    level: "intermediate",
    short: "the property of a numerical method that prevents small errors from growing unboundedly as the computation proceeds.",
    definition: "a method is stable for a given problem and step size if the numerical solution remains bounded whenever the true solution is bounded. unconditional stability means the property holds for any step size; conditional stability requires Δt below a critical value.",
    intuition: "an unstable integrator will eventually produce NaNs or wild oscillations even if the underlying physics is perfectly well-behaved.",
    why: "stability, not just accuracy, determines whether a long simulation can be trusted.",
    inWork: "energy drift is one symptom of marginal stability; the fixes applied to the contact model and the choice of integration schemes were driven by the need to keep long runs stable.",
    related: ["time-integration", "energy-drift", "time-step", "numerical-error"]
  },
  {
    id: "ill-conditioning",
    term: "ill-conditioning",
    categories: ["num-methods", "comp-mech"],
    status: "studied",
    level: "intermediate",
    short: "the situation in which a matrix or a problem amplifies small input perturbations into large output errors.",
    definition: "a linear system is ill-conditioned when its condition number is large. in finite-element contexts this arises from poor mesh quality, near-incompressibility, or large material contrasts.",
    intuition: "the matrix is almost singular; tiny changes in the right-hand side or in the matrix entries produce huge swings in the computed solution.",
    why: "iterative solvers converge slowly (or fail) on ill-conditioned systems, and the solution itself becomes sensitive to round-off.",
    inWork: "mesh-distortion warnings and the push for selective refinement are partly motivated by keeping the stiffness-matrix condition number under control.",
    related: ["condition-number", "matrix-conditioning", "preconditioning", "mesh-distortion"]
  },
  {
    id: "frobenius-norm",
    term: "frobenius norm",
    categories: ["num-methods", "math"],
    status: "used",
    level: "intermediate",
    short: "the matrix norm defined as the square root of the sum of the squares of all entries; equivalent to the euclidean norm of the matrix viewed as a long vector.",
    definition: "‖A‖_F = √(Σᵢⱼ |aᵢⱼ|²). it is convenient for comparing two matrices entry-wise and is used in the unit tests that verify sparse-matrix conversion accuracy.",
    intuition: "treat every entry of the matrix as a component of a giant vector and take the ordinary euclidean length of that vector.",
    why: "it gives a single scalar that measures “how different” two matrices are, which is exactly what a patch-test or conversion test needs.",
    inWork: "the coo→csr unit test asserts that the frobenius norm of (K_sparse – K_dense) is below 1e-12 for a 3-element patch.",
    related: ["norm", "verification", "unit-test", "sparse-matrix"]
  },
  {
    id: "design-for-manufacturability",
    term: "design for manufacturability",
    categories: ["cad-mfg", "topo-opt", "eng-method"],
    status: "used",
    level: "intermediate",
    short: "the practice of shaping a design so that it can be produced reliably and economically with the intended process.",
    definition: "design for manufacturability (dfm) considers process constraints — minimum feature size, draft angles, tool access, layer orientation, support requirements, etc. — while the geometry is still being decided, rather than discovering them after the design is frozen.",
    intuition: "a part that looks perfect in cad can still be impossible or insanely expensive to make. dfm is the habit of asking “can we actually build this?” at every step.",
    why: "topology optimization and generative design produce shapes that ignore manufacturing reality unless those constraints are explicitly built into the formulation or the post-processing.",
    inWork: "the minimum-member-size and morphological-closing experiments, the print-orientation studies, and the knockdown-factor work on the 2r link are all dfm-driven responses to the gap between idealized analysis and real fabrication.",
    related: ["minimum-member-size", "print-orientation", "fdm", "length-scale-control", "knockdown-factor"]
  },
  {
    id: "experimental-validation",
    term: "experimental validation",
    categories: ["experimental", "eng-method"],
    status: "used",
    level: "intermediate",
    short: "the comparison of simulation or analysis predictions against physical measurements to confirm that the model is faithful enough for its intended use.",
    definition: "experimental validation closes the loop between the digital model and the real system. it quantifies discrepancy, exposes missing physics (friction, compliance, anisotropy, etc.), and supplies the evidence needed to trust or revise the model.",
    intuition: "the simulation says the arm will settle in 0.4 s with 5 % overshoot. you run the real arm, measure what actually happens, and decide whether the model is good enough or needs another iteration.",
    why: "without experimental validation, simulation results remain hypotheses. every serious engineering claim eventually has to survive contact with measured data.",
    inWork: "the transfer of simulated pid gains to the physical 2r arm, the post-mortem of the printed forearm link, and the energy-drift checks against long simulation runs are all forms of experimental validation recorded in the lab journal.",
    related: ["validation", "verification", "post-mortem", "measurement-uncertainty", "root-cause-analysis"]
  }
];

/* =========================================================
   GLOSSARY UI CONTROLLER
   ========================================================= */

class GlossaryController {
  constructor() {
    this.data = GLOSSARY_DATA;
    this.categories = GLOSSARY_CATEGORIES;
    this.activeCategory = "all";
    this.activeLetter = "all";
    this.activeStatus = "all";
    this.activeLevel = "all";
    this.searchQuery = "";
    this.currentTermId = null;
    this.init();
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderCategoryPills();
    this.renderAlphabet();
    this.renderList();
  }

  cacheDom() {
    this.page = document.getElementById("page-glossary");
    this.listView = document.getElementById("glossary-list-view");
    this.detailView = document.getElementById("glossary-detail-view");
    this.searchInput = document.getElementById("glossary-search");
    this.termList = document.getElementById("glossary-term-list");
    this.categoryPills = document.getElementById("glossary-category-pills");
    this.alphabetBar = document.getElementById("glossary-alphabet");
    this.statusFilters = document.getElementById("glossary-status-filters");
    this.levelFilters = document.getElementById("glossary-level-filters");
    this.resultCount = document.getElementById("glossary-result-count");
    this.detailContent = document.getElementById("glossary-detail-content");
    this.backToListBtn = document.getElementById("glossary-back-to-list");
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderList();
      });
    }

    if (this.backToListBtn) {
      this.backToListBtn.addEventListener("click", () => this.showList());
    }

    // status filters
    if (this.statusFilters) {
      this.statusFilters.querySelectorAll("[data-status]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.statusFilters.querySelectorAll("[data-status]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.activeStatus = btn.dataset.status;
          this.renderList();
        });
      });
    }

    // level filters
    if (this.levelFilters) {
      this.levelFilters.querySelectorAll("[data-level]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.levelFilters.querySelectorAll("[data-level]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.activeLevel = btn.dataset.level;
          this.renderList();
        });
      });
    }
  }

  renderCategoryPills() {
    if (!this.categoryPills) return;
    this.categoryPills.innerHTML = "";

    // "all" pill
    const allBtn = document.createElement("button");
    allBtn.className = "glossary-cat-pill active";
    allBtn.dataset.cat = "all";
    allBtn.innerHTML = `<span class="cat-dot" style="background:#fff"></span> all`;
    allBtn.addEventListener("click", () => this.setCategory("all"));
    this.categoryPills.appendChild(allBtn);

    this.categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "glossary-cat-pill";
      btn.dataset.cat = cat.id;
      btn.innerHTML = `<span class="cat-dot" style="background:${cat.color}"></span> ${cat.name}`;
      btn.addEventListener("click", () => this.setCategory(cat.id));
      this.categoryPills.appendChild(btn);
    });
  }

  setCategory(id) {
    this.activeCategory = id;
    this.categoryPills.querySelectorAll(".glossary-cat-pill").forEach(b => {
      b.classList.toggle("active", b.dataset.cat === id);
    });
    this.renderList();
  }

  renderAlphabet() {
    if (!this.alphabetBar) return;
    this.alphabetBar.innerHTML = "";

    const all = document.createElement("button");
    all.className = "glossary-letter active";
    all.textContent = "all";
    all.addEventListener("click", () => this.setLetter("all"));
    this.alphabetBar.appendChild(all);

    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
      const btn = document.createElement("button");
      btn.className = "glossary-letter";
      btn.textContent = letter;
      btn.addEventListener("click", () => this.setLetter(letter));
      this.alphabetBar.appendChild(btn);
    });
  }

  setLetter(letter) {
    this.activeLetter = letter;
    this.alphabetBar.querySelectorAll(".glossary-letter").forEach(b => {
      b.classList.toggle("active", b.textContent.toLowerCase() === letter.toLowerCase() || (letter === "all" && b.textContent === "all"));
    });
    this.renderList();
  }

  getFiltered() {
    return this.data.filter(t => {
      if (this.activeCategory !== "all" && !t.categories.includes(this.activeCategory)) return false;
      if (this.activeStatus !== "all" && t.status !== this.activeStatus) return false;
      if (this.activeLevel !== "all" && t.level !== this.activeLevel) return false;
      if (this.activeLetter !== "all") {
        const first = t.term.replace(/^\(/, "").charAt(0).toUpperCase();
        if (first !== this.activeLetter) return false;
      }
      if (this.searchQuery) {
        const hay = (t.term + " " + t.short + " " + (t.definition || "")).toLowerCase();
        if (!hay.includes(this.searchQuery)) return false;
      }
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }

  renderList() {
    if (!this.termList) return;
    const filtered = this.getFiltered();
    if (this.resultCount) {
      this.resultCount.textContent = `${filtered.length} term${filtered.length === 1 ? "" : "s"}`;
    }

    this.termList.innerHTML = "";
    if (filtered.length === 0) {
      this.termList.innerHTML = `<div class="glossary-empty">no results found :(</div>`;
      return;
    }

    filtered.forEach(t => {
      const card = document.createElement("button");
      card.className = "glossary-term-card";
      card.innerHTML = `
        <div class="term-card-top">
          <span class="term-name">${t.term}</span>
          <div class="term-badges">
            <span class="status-badge status-${t.status}">${t.status}</span>
            <span class="level-badge level-${t.level}">${t.level}</span>
          </div>
        </div>
        <p class="term-short">${t.short}</p>
        <div class="term-cats">
          ${t.categories.map(cid => {
            const cat = this.categories.find(c => c.id === cid);
            return cat ? `<span class="mini-cat" style="--cat-color:${cat.color}">${cat.name}</span>` : "";
          }).join("")}
        </div>
      `;
      card.addEventListener("click", () => this.showDetail(t.id));
      this.termList.appendChild(card);
    });
  }

  showList() {
    this.currentTermId = null;
    if (this.listView) this.listView.classList.remove("hidden");
    if (this.detailView) this.detailView.classList.add("hidden");
  }

  showDetail(id) {
    const t = this.data.find(x => x.id === id);
    if (!t || !this.detailContent) return;
    this.currentTermId = id;

    if (this.listView) this.listView.classList.add("hidden");
    if (this.detailView) this.detailView.classList.remove("hidden");

    const catHtml = t.categories.map(cid => {
      const cat = this.categories.find(c => c.id === cid);
      return cat ? `<span class="detail-cat" style="--cat-color:${cat.color}">${cat.name}</span>` : "";
    }).join("");

    const eqHtml = (t.equations || []).map(eq => {
      if (eq.tex) {
        return `<div class="eq-block"><div class="eq-label">${eq.label || ""}</div><div class="eq-tex">${eq.tex}</div></div>`;
      }
      return `<div class="eq-block"><div class="eq-label">${eq.label || ""}</div><div class="eq-note">${eq.note || ""}</div></div>`;
    }).join("");

    const relatedHtml = (t.related || []).map(rid => {
      const rt = this.data.find(x => x.id === rid);
      if (!rt) return `<span class="related-missing">${rid}</span>`;
      return `<button class="related-term" data-id="${rt.id}" title="${rt.short}">${rt.term}</button>`;
    }).join("");

    this.detailContent.innerHTML = `
      <div class="detail-header">
        <h2 class="detail-title">${t.term}</h2>
        <div class="detail-meta">
          <span class="status-badge status-${t.status}">${t.status} in nabil's work</span>
          <span class="level-badge level-${t.level}">${t.level}</span>
        </div>
        <div class="detail-cats">${catHtml}</div>
      </div>

      <hr class="detail-divider">

      <section class="detail-section">
        <h3>quick definition</h3>
        <p>${t.short}</p>
      </section>

      <section class="detail-section">
        <h3>definition</h3>
        <p>${t.definition || t.short}</p>
      </section>

      <section class="detail-section">
        <h3>in plain english</h3>
        <p>${t.intuition || ""}</p>
      </section>

      ${eqHtml ? `
      <section class="detail-section">
        <h3>mathematical formulation</h3>
        ${eqHtml}
      </section>` : ""}

      <section class="detail-section">
        <h3>why it matters</h3>
        <p>${t.why || ""}</p>
      </section>

      <section class="detail-section">
        <h3>in nabil's work</h3>
        <p>${t.inWork || "not yet applied in a finished project."}</p>
      </section>

      <section class="detail-section">
        <h3>related concepts</h3>
        <div class="related-row">${relatedHtml || "<span class='muted'>none linked yet</span>"}</div>
      </section>
    `;

    // bind related clicks
    this.detailContent.querySelectorAll(".related-term").forEach(btn => {
      btn.addEventListener("click", () => this.showDetail(btn.dataset.id));
    });

    // scroll detail into view
    if (this.page) this.page.scrollTo(0, 0);
  }
}

// bootstrap when the glossary page is first opened
window.initGlossary = function () {
  if (!window._glossaryController) {
    window._glossaryController = new GlossaryController();
  }
};
