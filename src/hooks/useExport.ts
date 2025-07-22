import { useState } from "react";

export function useExport() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const openExportDialog = () => {
    setIsExportDialogOpen(true);
  };

  const closeExportDialog = () => {
    setIsExportDialogOpen(false);
  };

  return {
    isExportDialogOpen,
    openExportDialog,
    closeExportDialog,
  };
}
