const SectionHeader = ({ icon: Icon, title, count }) => (
  <h4 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
    <Icon className="w-5 h-5 text-primary" />
    {title}
    {count > 0 && (
      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
        {count}
      </span>
    )}
  </h4>
);

export default SectionHeader;