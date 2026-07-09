import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { T } from "../theme.js";

export default function Progress({ history }) {
  const tipStyle = { background: T.panel2, border: `1px solid ${T.line}`, borderRadius: 8, color: T.text, fontSize: 12 };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
        <div className="mono text-xs tracking-widest mb-3" style={{ color: T.dim }}>TRAINING VOLUME (KG)</div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid stroke={T.line} strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="date" stroke={T.dim} fontSize={11} tickLine={false} />
              <YAxis stroke={T.dim} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Line type="monotone" dataKey="volume" stroke={T.amber} strokeWidth={3} dot={{ fill: T.amber, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
        <div className="mono text-xs tracking-widest mb-3" style={{ color: T.dim }}>REPS & CALORIES BURNED</div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={history}>
              <CartesianGrid stroke={T.line} strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="date" stroke={T.dim} fontSize={11} tickLine={false} />
              <YAxis stroke={T.dim} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="reps" fill={T.teal} radius={[4, 4, 0, 0]} />
              <Bar dataKey="kcal" fill={T.coral} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-2 rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
        <div className="mono text-xs tracking-widest mb-2" style={{ color: T.dim }}>COACH'S READ</div>
        <p className="text-sm leading-relaxed" style={{ color: T.text }}>
          Volume is trending <span style={{ color: T.green }}>+33% over the week</span> with rep quality holding
          steady — a good sign your progression rate is sustainable. The Jul 6 dip lines up with a shorter
          session, not a strength loss. Keep sessions 48h apart per muscle group, and if today's set logs push
          volume past <span className="mono" style={{ color: T.amber }}>6,000 kg</span>, consider a lighter
          technique day next.
        </p>
      </div>
    </div>
  );
}
