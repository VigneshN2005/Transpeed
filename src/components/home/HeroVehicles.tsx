// Animated plane / ship / truck scene for the home hero (2026-10-02, per
// Vignesh, relaying the client: plane, ship and truck moving in the hero —
// "make them move some distance and after that they must move in 1 place ...
// truck below from right to left and in mid route switches on the light,
// ship sailing and leaves the smoke, sailing from left to right and plane
// from right to left").
//
// Each vehicle first DRIVES IN a real distance (entrance animation), then
// "cruises in place": the vehicle itself stays put while its surroundings
// keep moving past it (clouds + speed streaks for the plane, rolling waves +
// funnel smoke for the ship, road markings + spinning wheels for the
// truck), so it reads as continuous travel without ever leaving the frame.
//   - Plane: top band, flies in right -> left, then floats gently.
//   - Ship: bottom band (sea lane), sails in left -> right, then rocks on
//     the waves with smoke drifting back from the funnel.
//   - Truck: bottom band (road lane, below the sea), drives in right -> left
//     and switches its headlights on halfway through the drive.
//
// DIRECTIONS REVERSED (2026-10-02, Vignesh: "can u make it reverse, i mean
// plane and truck from left to right, ship from right to left"). Done by
// mirroring each vehicle (scaleX(-1) wrapper) and flipping the entrance
// keyframes + the scenery loops (clouds, waves, road markings); smoke and
// wheel spin follow automatically from the mirror. The truck's TRANSPEED
// lettering is counter-mirrored so it still reads correctly.
// Resting spots then moved (same day: "keep the truck and plane on the
// left, and ship on the right"): plane 14%, truck 10%, ship 64%.
// Waves + road slowed ~2.2x (same day: "make the sea wave movement and the
// track movement slow"); wheel spin slowed to match the slower road.
// Pure SVG + CSS keyframes, no JS / no video, so it costs nothing to load.
// Desktop only (lg+) — the hero stacks into a single column below that and
// has no empty bands to hold it. prefers-reduced-motion: everything is shown
// parked in its final position with the looping motion switched off.

const CSS = `
.hv * { box-sizing: border-box; }
@keyframes hv-plane-in { from { transform: translateX(-60vw); } to { transform: translateX(0); } }
@keyframes hv-ship-in  { from { transform: translateX(70vw); } to { transform: translateX(0); } }
@keyframes hv-truck-in { from { transform: translateX(-70vw); } to { transform: translateX(0); } }
@keyframes hv-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-9px) rotate(-1.2deg); } }
@keyframes hv-rock  { 0%,100% { transform: rotate(-1.1deg) translateY(0); } 50% { transform: rotate(1.1deg) translateY(2px); } }
@keyframes hv-rumble { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
@keyframes hv-cloud { from { transform: translateX(115vw); } to { transform: translateX(-30vw); } }
@keyframes hv-streak { 0% { transform: translateX(0); opacity: 0; } 20% { opacity: .55; } 100% { transform: translateX(140px); opacity: 0; } }
@keyframes hv-waves-l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes hv-smoke { 0% { transform: translate(0,0) scale(.35); opacity: .55; } 100% { transform: translate(-70px,-46px) scale(1.7); opacity: 0; } }
@keyframes hv-road { from { background-position: 0 0; } to { background-position: 120px 0; } }
@keyframes hv-spin { to { transform: rotate(-360deg); } }
@keyframes hv-lights { from { opacity: 0; } to { opacity: 1; } }

.hv-plane-in { animation: hv-plane-in 3.6s cubic-bezier(.2,.75,.25,1) both; }
.hv-ship-in  { animation: hv-ship-in 5s cubic-bezier(.2,.75,.25,1) both .3s; }
.hv-truck-in { animation: hv-truck-in 4.6s cubic-bezier(.2,.75,.25,1) both .6s; }
.hv-float  { animation: hv-float 5.5s ease-in-out infinite; }
.hv-rock   { animation: hv-rock 4.2s ease-in-out infinite; transform-origin: 50% 90%; }
.hv-rumble { animation: hv-rumble .35s linear infinite; }
.hv-cloud  { position: absolute; animation: hv-cloud linear infinite; }
.hv-streak { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, rgba(255,255,255,.5), transparent); animation: hv-streak 1.1s linear infinite; }
.hv-waves  { animation: hv-waves-l 16s linear infinite; animation-direction: reverse; }
.hv-waves2 { animation: hv-waves-l 26s linear infinite; animation-direction: reverse; }
.hv-puff   { transform-box: fill-box; transform-origin: center; animation: hv-smoke 3.2s ease-out infinite; }
.hv-road   { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.35) 0 44px, transparent 44px 120px); animation: hv-road 2s linear infinite; animation-direction: reverse; }
.hv-wheel  { transform-box: fill-box; transform-origin: center; animation: hv-spin 1.2s linear infinite; }
.hv-beam   { opacity: 0; animation: hv-lights .5s ease-out forwards 2.9s; }

.hv-shipzone { position: absolute; right: 0; bottom: 200px; width: calc((100vw - 1152px) / 2); display: flex; justify-content: center; }
@media (max-width: 1439px) { .hv-shipzone { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .hv *, .hv { animation: none !important; }
  .hv-beam { opacity: 1; }
  .hv-cloud, .hv-streak, .hv-puff { display: none; }
}
`;

function Plane() {
  // Facing LEFT (nose at x≈6), ~186 x 56
  return (
    <svg viewBox="0 0 190 58" width="210" height="64" aria-hidden="true">
      <path d="M100 22 L112 22 L126 6 L116 6 Z" fill="#454545" />
      <path
        d="M6 30 C6 24 18 20 30 20 L150 20 L170 3 L184 3 L170 24 L173 30 C173 34 166 36 151 36 L30 36 C18 36 6 34 6 30 Z"
        fill="#7a7a7a"
      />
      <path d="M150 20 L170 3 L184 3 L170 22 Z" fill="#FF3131" />
      <rect x="30" y="31.5" width="122" height="2.2" rx="1" fill="#FF3131" />
      <path d="M13 25.5 L27 22.8 L27 27.5 L11 28.5 Z" fill="#d6dde3" opacity=".75" />
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={i} cx={40 + i * 9.5} cy={26.5} r={1.5} fill="rgba(255,255,255,.55)" />
      ))}
      <path d="M68 31 L106 31 L128 54 L114 54 Z" fill="#5c5c5c" />
      <ellipse cx="96" cy="41" rx="13" ry="4.6" fill="#3a3a3a" />
      <path d="M156 31 L176 31 L184 40 L174 40 Z" fill="#5c5c5c" />
    </svg>
  );
}

function Ship() {
  // Facing RIGHT (bow at right), ~260 x 100
  const box = (x: number, y: number, c: string) => (
    <rect key={`${x}-${y}`} x={x} y={y} width={21} height={10} rx={1} fill={c} stroke="rgba(0,0,0,.35)" strokeWidth={0.8} />
  );
  const cols = ["#FF3131", "#8c8c8c", "#5e5e5e", "#b52a2a", "#a3a3a3", "#FF3131", "#6e6e6e", "#8c8c8c"];
  return (
    <svg viewBox="0 0 262 104" width="270" height="108" aria-hidden="true" overflow="visible" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* smoke puffs from the funnel, drifting back (left) */}
      {[0, 1.05, 2.1].map((d) => (
        <circle key={d} className="hv-puff" cx={32} cy={10} r={9} fill="rgba(225,225,225,.42)" style={{ animationDelay: `${d}s` }} />
      ))}
      {/* funnel + bridge at the stern */}
      <rect x="26" y="10" width="12" height="18" fill="#FF3131" />
      <rect x="26" y="10" width="12" height="4" fill="#1d1d1d" />
      <rect x="16" y="28" width="32" height="42" rx="1.5" fill="#6a6a6a" />
      {[0, 1, 2].map((r) => (
        <rect key={r} x="19" y={33 + r * 10} width="26" height="4" rx="1" fill="rgba(220,230,240,.6)" />
      ))}
      {/* containers */}
      {cols.map((c, i) => box(54 + i * 22, 58, c))}
      {cols.slice(1).map((c, i) => box(76 + i * 22, 48, cols[(i + 3) % cols.length]))}
      {[0, 1, 2, 3].map((i) => box(120 + i * 22, 38, cols[(i + 5) % cols.length]))}
      {/* hull */}
      <path d="M2 70 L252 70 Q258 70 255 76 L236 102 L20 102 L6 80 Q2 74 2 70 Z" fill="#454545" />
      <path d="M10 92 L244 92 L240 98 L14 98 Z" fill="#FF3131" />
      <circle cx="232" cy="78" r="3" fill="rgba(255,255,255,.35)" />
    </svg>
  );
}

function Truck() {
  // Facing LEFT (cab at left), ~236 x 82, beam extends further left
  return (
    <svg viewBox="-140 0 380 86" width="380" height="86" aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="hv-beam" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#FFE2A8" stopOpacity=".6" />
          <stop offset="1" stopColor="#FFE2A8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="hv-beam" d="M6 50 L-135 36 L-135 74 L6 58 Z" fill="url(#hv-beam)" />
      {/* trailer container */}
      <rect x="62" y="8" width="166" height="52" rx="3" fill="#4d4d4d" stroke="rgba(255,255,255,.18)" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={70 + i * 12} y="14" width="1.6" height="40" fill="rgba(0,0,0,.25)" />
      ))}
      <rect x="62" y="8" width="166" height="5" rx="2" fill="#FF3131" />
      <text x="145" y="41" transform="matrix(-1 0 0 1 290 0)" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="2" fill="rgba(255,255,255,.8)" fontFamily="Segoe UI, Arial, sans-serif">
        TRANSPEED
      </text>
      {/* cab */}
      <path d="M58 64 V22 Q58 14 50 14 H28 Q20 14 16 22 L6 40 V64 Z" fill="#FF3131" />
      <path d="M24 20 H50 V36 H13 Z" fill="#d6dde3" opacity=".6" />
      <rect x="5" y="49" width="6" height="5" rx="1" fill="#FFE2A8" />
      <rect x="4" y="58" width="56" height="4" fill="#1f1f1f" />
      {/* chassis */}
      <rect x="4" y="62" width="226" height="5" fill="#222" />
      {/* wheels */}
      {[30, 152, 176, 200].map((cx) => (
        <g key={cx} className="hv-wheel">
          <circle cx={cx} cy={70} r={10} fill="#141414" stroke="#7a7a7a" strokeWidth={2} />
          <path d={`M${cx - 6} 70h12 M${cx} 64v12`} stroke="#9a9a9a" strokeWidth={1.6} />
        </g>
      ))}
    </svg>
  );
}

function WaveStrip({ className, opacity, y }: { className: string; opacity: number; y: number }) {
  // 2x-wide repeating wave so a -50% translate loops seamlessly
  const seg = "q 30 -9 60 0 t 60 0 t 60 0 t 60 0";
  const d = `M0 10 ${Array.from({ length: 24 }, () => seg).join(" ")}`;
  return (
    <div className="absolute inset-x-0 overflow-hidden" style={{ top: y, height: 20 }}>
      <svg className={className} width="5760" height="20" viewBox="0 0 5760 20" preserveAspectRatio="none" style={{ display: "block" }}>
        <path d={d} fill="none" stroke={`rgba(255,255,255,${opacity})`} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Cloud({ top, dur, delay, scale }: { top: number; dur: number; delay: number; scale: number }) {
  return (
    <div className="hv-cloud" style={{ top, left: 0, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
      <svg width={120 * scale} height={40 * scale} viewBox="0 0 120 40" aria-hidden="true">
        <path
          d="M14 34 C2 34 2 20 14 20 C14 8 32 6 38 16 C44 2 70 2 74 18 C84 10 102 14 100 26 C114 26 114 34 104 34 Z"
          fill="rgba(255,255,255,.07)"
        />
      </svg>
    </div>
  );
}

export default function HeroVehicles() {
  return (
    <div className="hv pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
      <style>{CSS}</style>

      {/* ── Top band: sky with drifting clouds + the plane ── */}
      <div className="absolute inset-x-0" style={{ top: 48, height: 120 }}>
        <Cloud top={10} dur={34} delay={-4} scale={1.2} />
        <Cloud top={58} dur={26} delay={-15} scale={0.8} />
        <Cloud top={30} dur={40} delay={-28} scale={1.5} />
        <div className="absolute" style={{ left: "14%", top: 22 }}>
          <div className="hv-plane-in">
            <div className="hv-float relative">
              <div style={{ transform: "scaleX(-1)" }}>
              {/* speed streaks trailing behind the plane (mirrored with it) */}
              <span className="hv-streak" style={{ left: 170, top: 18, width: 70, animationDelay: "0s" }} />
              <span className="hv-streak" style={{ left: 190, top: 34, width: 50, animationDelay: ".4s" }} />
              <span className="hv-streak" style={{ left: 160, top: 46, width: 60, animationDelay: ".75s" }} />
              <Plane />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ship: in the empty right-hand gutter beside the customs card,
          on its OWN small patch of sea that fades out at both ends (2026-10-02,
          Vignesh: "keep the ship somewhere there ... don't cover the entire
          hero with sea ... ship and truck seem clumsy one above other").
          Sized to the gutter; hidden on screens too narrow to have one. ── */}
      <div className="hv-shipzone">
        <div className="hv-ship-in" style={{ width: "min(270px, calc(100% - 28px))" }}>
          <div className="hv-rock">
            <div style={{ transform: "scaleX(-1)" }}>
              <Ship />
            </div>
          </div>
          <div
            className="relative"
            style={{
              marginTop: -16,
              height: 34,
              marginInline: "-30%",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent)",
              maskImage: "linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent)",
            }}
          >
            <WaveStrip className="hv-waves" opacity={0.26} y={0} />
            <WaveStrip className="hv-waves2" opacity={0.14} y={13} />
          </div>
        </div>
      </div>

      {/* ── Bottom band: road lane (truck) ── */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: 110 }}>
        <div className="absolute inset-x-0" style={{ bottom: 19, height: 2, background: "rgba(255,255,255,.14)" }} />
        <div className="hv-road absolute inset-x-0" style={{ bottom: 6, height: 3 }} />
        <div className="absolute" style={{ left: "10%", bottom: 12 }}>
          <div className="hv-truck-in">
            <div className="hv-rumble">
              <div style={{ transform: "scaleX(-1)" }}>
                <Truck />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
