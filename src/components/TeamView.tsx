"use client";
import React from "react";
import {Box,Paper,Typography,Stack,IconButton,Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTeams } from "@/context/TeamsContext";
import { motion, AnimatePresence } from "framer-motion";
import { Pokemon } from "@/types/pokemon";

function calcStats(pokemons: Pokemon[]) {
  const types = new Set(pokemons.flatMap((p) => p.types));
  const avg = pokemons.length
    ? Math.round(
        pokemons.reduce((s, p) => s + p.baseExperience, 0) / pokemons.length
      )
    : 0;
  return { uniqueTypes: types.size, avgBaseXP: avg };
}

export default function TeamView() {
  const { teams, selectedTeamId, removePokemon } = useTeams();
  const team = teams.find((t) => t.id === selectedTeamId);

  if (!team) return <Typography>No team selected</Typography>;

  const stats = calcStats(team.pokemons);

  return (
    <Box sx={{ p: 2, overflowY:"hidden" }}>
      {/* Team Header and Stats */}
      <Stack spacing={1} overflow={"hidden"}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {team.name}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="body2" fontWeight={"bold"} fontSize={16}>
            Types covered: {stats.uniqueTypes}
          </Typography>
          <Typography variant="body2" fontWeight={"bold"} fontSize={16}>Avg base XP: {stats.avgBaseXP}</Typography>
        </Paper>
      </Stack>

      {/* Pokémon Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          mt: 4,
        }}
      >
        <AnimatePresence>
          {team.pokemons.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tooltip
                title={
                  <Box>
                    <Typography>HP: {p.stats.hp}</Typography>
                    <Typography>Attack: {p.stats.attack}</Typography>
                    <Typography>Defense: {p.stats.defense}</Typography>
                    <Typography>Sp. Atk: {p.stats.specialAttack}</Typography>
                    <Typography>Sp. Def: {p.stats.specialDefense}</Typography>
                    <Typography>Speed: {p.stats.speed}</Typography>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Paper
                  sx={{
                    position: "relative",
                    flex: "1 1 250px",
                    maxWidth: "400px",
                    minWidth: "300px",
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 4,
                    "&:hover .remove-btn": { display: "flex" },
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      mt: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.8rem",
                    }}
                  >
                    {p.name}
                  </Typography>

                  {/* Remove Button on hover */}
                  <IconButton
                    className="remove-btn"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      display: "none",
                      bgcolor: "rgba(255,255,255,0.8)",
                    }}
                    onClick={() => removePokemon(p.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
