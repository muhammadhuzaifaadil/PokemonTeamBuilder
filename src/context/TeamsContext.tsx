"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Team, Pokemon } from "@/types/pokemon";
import { v4 as uuidv4 } from "uuid";

type AddPokemonResult = { ok: true } | { ok: false; reason: "duplicate" | "full" | "no-team" };

type TeamsContextType = {
  teams: Team[];
  selectedTeamId: string;
  createTeam: (name: string) => void;
  renameTeam: (id: string, name: string) => void;
  deleteTeam: (id: string) => void;
  switchTeam: (id: string) => void;
  addPokemon: (p: Pokemon) => AddPokemonResult;
  removePokemon: (pokemonId: number) => void;
};

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

const STORAGE_KEY = "pokemon_teams_v1";

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const defaultTeam: Team = { id: uuidv4(), name: "My First Team", pokemons: [] };
  const [teams, setTeams] = useState<Team[]>([defaultTeam]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(defaultTeam.id);
    console.log("Teams on mount:", teams, "Selected:", selectedTeamId);

  // load from localStorage (only on client, this is a client component)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Team[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
          setSelectedTeamId(parsed[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to read teams from localStorage", err);
    }
  }, []);

  // saving teams
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch (err) {
      console.warn("Failed to save teams to localStorage", err);
    }
  }, [teams]);

  // ensure selectedTeamId always points to an existing team
  useEffect(() => {
    if (!teams.find((t) => t.id === selectedTeamId)) {
      if (teams.length > 0) setSelectedTeamId(teams[0].id);
      else {
        const fallback = { id: uuidv4(), name: "My First Team", pokemons: [] };
        setTeams([fallback]);
        setSelectedTeamId(fallback.id);
      }
    }
  }, [teams, selectedTeamId]);

  const createTeam = (name: string) => {
    const newTeam: Team = { id: uuidv4(), name: name || "New Team", pokemons: [] };
    setTeams((prev) => [...prev, newTeam]);
    setSelectedTeamId(newTeam.id);
  };

  const renameTeam = (id: string, name: string) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  };

const deleteTeam = (id: string) => {
  setTeams((prev) => {
    const next = prev.filter((t) => t.id !== id);

    if (next.length === 0) {
      const fallback: Team = { id: uuidv4(), name: "My First Team", pokemons: [] };
      setSelectedTeamId(fallback.id);
      return [fallback];
    }
    if (id === selectedTeamId) {
      setSelectedTeamId(next[0].id);
    }
    return next;
  });
};

  const switchTeam = (id: string) => {
    if (teams.find((t) => t.id === id)) setSelectedTeamId(id);
  };
  const addPokemon = (p: Pokemon): AddPokemonResult => {
    const team = teams.find((t) => t.id === selectedTeamId);
    if (!team) return { ok: false, reason: "no-team" };

    if (team.pokemons.find((x) => x.id === p.id)) return { ok: false, reason: "duplicate" };
    if (team.pokemons.length >= 6) return { ok: false, reason: "full" };
    
    setTeams((prev) =>
      prev.map((t) => (t.id === selectedTeamId ? { ...t, pokemons: [...t.pokemons, p] } : t))
    );
    return { ok: true };
  };

  const removePokemon = (pokemonId: number) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === selectedTeamId ? { ...t, pokemons: t.pokemons.filter((p) => p.id !== pokemonId) } : t
      )
    );
  };

  const value: TeamsContextType = {
    teams,
    selectedTeamId,
    createTeam,
    renameTeam,
    deleteTeam,
    switchTeam,
    addPokemon,
    removePokemon,
  };

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export const useTeams = () => {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error("useTeams must be used inside TeamsProvider");
  return ctx;
};
