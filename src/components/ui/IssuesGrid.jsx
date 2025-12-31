import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const IssuesGrid = ({ totalIssues = 130, readIssues = [], onIssueClick, comicId }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const issuesPerSection = 30;
  const totalSections = Math.ceil(totalIssues / issuesPerSection);

  const getIssueStatus = (issueNumber) => {
    return readIssues.includes(issueNumber) ? "read" : "unread";
  };

  const getIssueColor = (status) => {
    switch (status) {
      case "read":
        return "text-white";
      case "unread":
        return "text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIssueStyle = (status) => {
    switch (status) {
      case "read":
        return { backgroundColor: 'var(--status-completed)' };
      case "unread":
        return { backgroundColor: 'var(--status-reading)' };
      default:
        return {};
    }
  };

  const renderSection = (sectionIndex) => {
    const startIssue = sectionIndex * issuesPerSection + 1;
    const endIssue = Math.min(startIssue + issuesPerSection - 1, totalIssues);
    const issues = [];

    for (let i = startIssue; i <= endIssue; i++) {
      const status = getIssueStatus(i);
      issues.push(
        <div
          key={i}
          onClick={() => {
            if (onIssueClick && comicId) {
              onIssueClick(comicId, i);
            }
          }}
          className={`
            aspect-square rounded-lg flex items-center justify-center text-sm font-medium
            cursor-pointer transition-all duration-200 border border-border/50
            hover:opacity-80 hover:scale-105
            ${getIssueColor(status)}
          `}
          style={getIssueStyle(status)}
          title={`Issue #${i} - ${status === "read" ? "Read" : "Not Read"} (Click to toggle)`}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {issues}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-card-foreground">
          Issues ({totalIssues} total)
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Section {currentSection + 1} of {totalSections}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentSection(Math.min(totalSections - 1, currentSection + 1))
            }
            disabled={currentSection === totalSections - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-2">
          Issues {currentSection * issuesPerSection + 1} -{" "}
          {Math.min((currentSection + 1) * issuesPerSection, totalIssues)}
        </div>
        {renderSection(currentSection)}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--status-completed)' }}></div>
          <span>Read ({readIssues.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--status-reading)' }}></div>
          <span>Unread ({totalIssues - readIssues.length})</span>
        </div>
      </div>
    </div>
  );
};

export default IssuesGrid;
