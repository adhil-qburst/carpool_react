export type RouteFilterType = "all" | "active" | "inactive";

export type RouteFilterTabsProps = {
  activeTab: RouteFilterType;
  onTabChange: (tab: RouteFilterType) => void;
  allCount: number;
  activeCount: number;
  inactiveCount: number;
};

const RouteFilterTabs = ({
  activeTab,
  onTabChange,
  allCount,
  activeCount,
  inactiveCount,
}: RouteFilterTabsProps) => {
  const tabs: { key: RouteFilterType; label: string; count: number }[] = [
    { key: "all", label: "All Routes", count: allCount },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
  ];

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-card p-1 shadow-xs">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 rounded-lg py-1.5 px-3 text-center text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
              isSelected
                ? "border border-surface-mint-border bg-surface-mint text-primary"
                : "text-text-muted hover:bg-surface-container-low hover:text-on-surface font-medium"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
};

export default RouteFilterTabs;
