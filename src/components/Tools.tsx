import { marqueeItems, toolGroups } from "@/data/tools";

export function Tools() {
  return (
    <section id="ferramentas" className="section">
      <p className="eyebrow">02 // loadout</p>
      <h2>ferramentas</h2>

      <div className="tools">
        {toolGroups.map((group) => (
          <div className="tool-block" key={group.title}>
            <h3>{group.title}</h3>
            <div className="pills">
              {group.items.map((item, i) => (
                <span className="pill" style={{ ["--i" as string]: i }} key={item.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.icon} alt="" width={16} height={16} />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="stack-marquee" aria-hidden="true">
        <div className="stack-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
