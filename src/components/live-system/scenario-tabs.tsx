import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/lib/scenarios";

export type ScenarioTab = { id: string; label: string; href: StaticPathname };

export function ScenarioTabs({
  label,
  tabs,
  selected,
}: {
  label: string;
  tabs: ScenarioTab[];
  selected: string;
}) {
  return (
    <div className="ls-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => {
        const isSelected = tab.id === selected;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            id={`ls-tab-${tab.id}`}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`ls-stage-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            className="ls-tab"
            data-ls-tab={tab.id}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
