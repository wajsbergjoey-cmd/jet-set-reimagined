import { useEffect, useState, type CSSProperties } from "react";

const GHOST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function ghostChar(char: string, index: number) {
  if (char === " ") return " ";
  return GHOST[(char.charCodeAt(0) + index * 7) % GHOST.length];
}

function Cell({ char, index, delay }: { char: string; index: number; delay: number }) {
  const style = { "--d": `${delay + index * 26}ms` } as CSSProperties;
  return (
    <span className="flap-cell" style={style}>
      <span className="flap-face flap-final">{char === " " ? " " : char}</span>
      <span className="flap-face flap-cover" aria-hidden="true">
        {ghostChar(char, index)}
      </span>
    </span>
  );
}

function FlapText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flap-line">
        {text.split("").map((char, index) => (
          <Cell key={`${index}-${char}-${delay}`} char={char} index={index} delay={delay} />
        ))}
      </span>
    </span>
  );
}

const FLIGHTS = [
  { dest: "MAUI", region: "HAWAII", gate: "01", statuses: ["BOARDING", "CHECK IN", "BOARDING"] },
  { dest: "AMALFI", region: "ITALY", gate: "02", statuses: ["ON TIME", "BOARDING", "ON TIME"] },
  { dest: "CANCUN", region: "MEXICO", gate: "03", statuses: ["CHECK IN", "ON TIME", "CHECK IN"] },
  { dest: "TURKS", region: "CAICOS", gate: "04", statuses: ["BOARDING", "ON TIME", "FINAL CALL"] },
];

export function DepartureBoard({ className = "" }: { className?: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 3400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`board ${className}`}>
      <div className="board-head">
        <FlapText text="DEPARTURES" className="board-title" />
        <span className="board-live">
          <span className="board-dot" aria-hidden="true" />
          TODAY
        </span>
      </div>

      <div className="board-cols" aria-hidden="true">
        <span>DESTINATION</span>
        <span>GATE</span>
        <span>STATUS</span>
      </div>

      <ul className="board-list">
        {FLIGHTS.map((flight, row) => {
          const status = flight.statuses[(tick + row) % flight.statuses.length];
          return (
            <li className="board-row" key={flight.dest}>
              <span className="board-dest-wrap">
                <FlapText text={flight.dest} delay={row * 90} className="board-dest" />
                <span className="board-region">{flight.region}</span>
              </span>
              <FlapText text={flight.gate} delay={row * 90 + 60} className="board-gate" />
              <FlapText text={status} delay={row * 90 + 140} className="board-status" />
            </li>
          );
        })}
      </ul>

      <p className="board-foot">Every trip booked through me costs you nothing extra.</p>
    </div>
  );
}
