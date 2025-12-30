const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
    <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;