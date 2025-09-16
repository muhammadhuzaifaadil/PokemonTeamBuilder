"use client";

import React, { useState } from "react";
import { Box, Stack, TextField, Button, List, ListItemButton, ListItemText, Divider, IconButton, Typography } from "@mui/material";
import { useTeams } from "@/context/TeamsContext";
import ConfirmDialog from "./ConfirmDialog";

type TeamSidebarProps = {
  setOpen?: (open: boolean) => void; // optional prop for mobile drawer
};

export default function TeamSidebar({ setOpen }: TeamSidebarProps) {
  const { teams, selectedTeamId, switchTeam, createTeam, renameTeam, deleteTeam } = useTeams();
  const [editingName, setEditingName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  return (
    <Box sx={{ width: 280, p: 2,overflowX: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Teams</Typography>
      </Stack>

      <List>
        {teams.map((t) => (
          <ListItemButton
            sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
            key={t.id}
            selected={t.id === selectedTeamId}
            onClick={() => {
              switchTeam(t.id);
              if (setOpen) setOpen(false); // close drawer on mobile
            }}
          >
            <ListItemText primary={t.name} />
            <IconButton
                size="small"
                onClick={(e) => {
                e.stopPropagation();
                setCurrentTeamId(t.id);
                setRenameValue(t.name);
                setRenameDialogOpen(true);
                    }}>
                        ✏️
                    </IconButton>
            <IconButton
                size="small"
                onClick={(e) => {
                e.stopPropagation();
                setCurrentTeamId(t.id);
                setDeleteDialogOpen(true);
                }}>
                        🗑️
                    </IconButton>
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <Stack direction="row" spacing={1} sx={{ overflowX: "hidden" }}>
        <TextField
          size="small"
          placeholder="New team name"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
        />
        <Button
          onClick={() => {
            if (editingName.trim()) {
              createTeam(editingName.trim());
              setEditingName("");
            }
          }}
        >
          Add
        </Button>
      </Stack>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Team?"
        message="Are you sure you want to delete this team?"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (currentTeamId) deleteTeam(currentTeamId);
          setDeleteDialogOpen(false);
          setCurrentTeamId(null);
        }}
      />

      {/* Rename Dialog */}
      <ConfirmDialog
        open={renameDialogOpen}
        title="Rename Team"
        isInput
        defaultValue={renameValue}
        onClose={() => setRenameDialogOpen(false)}
        onConfirm={(newName) => {
    if (currentTeamId && newName?.trim()) renameTeam(currentTeamId, newName.trim());
    setRenameDialogOpen(false);
    setCurrentTeamId(null);
  }}
/>
    </Box>
  );
  
}

