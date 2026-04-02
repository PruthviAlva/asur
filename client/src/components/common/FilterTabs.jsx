export default function FilterTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.value
              ? "bg-orange-500 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
