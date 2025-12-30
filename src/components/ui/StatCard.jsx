const StatCard = ({ icon: Icon, label, value }) => (
  <div className="p-3 bg-muted/50 rounded-lg">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-primary" />
      <p className="text-muted-foreground">{label}</p>
    </div>
    <p className="font-medium text-foreground">
      {value || 'Unknown'}
    </p>
  </div>
);

export default StatCard;