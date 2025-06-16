export var GameTaskType;
(function (GameTaskType) {
    GameTaskType["Maintenance"] = "Maintenance";
    GameTaskType["Opportunity"] = "Opportunity";
    GameTaskType["Endeavour"] = "Endeavour";
    GameTaskType["Quest"] = "Quest";
})(GameTaskType || (GameTaskType = {}));
export var GameTaskStatus;
(function (GameTaskStatus) {
    GameTaskStatus["Available"] = "Available";
    GameTaskStatus["Queued"] = "Queued";
    GameTaskStatus["Processing"] = "Processing";
    GameTaskStatus["Paused"] = "Paused";
    GameTaskStatus["Complete"] = "Complete";
})(GameTaskStatus || (GameTaskStatus = {}));
