import PanelTitle from '../../PanelTitle';
import ControlPanel from './Gauges';
import RandomProperties from './RandomProperties';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button';
import type { Planet, Star } from '@/types/stellar';
import { type InstrumentRole } from '@/types/planetProperties';
import { StellarSystem } from '@/audio/core/StellarSystem';
import { useCallback, useEffect, useState } from 'react';
import {
  getSynthProfilesForRole,
  getAvailableOscillatorOptions,
  getDefaultSynthType,
  getDefaultOscillatorType,
  type SynthTypeId,
  type OscillatorTypeId,
} from '@/audio/instruments/InstrumentInterface';
import RandomInstrument from './RandomInstrument';

const soundTypeList: InstrumentRole[] = [
  'DRUM',
  'BASS',
  'CHORD',
  'MELODY',
  'ARPEGGIO',
  'PAD',
];

export default function Properties() {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();
  const system = StellarSystem.instance;

  // 선택된 행성의 재생 상태 추적
  const [isPlanetPlaying, setIsPlanetPlaying] = useState(false);

  const { star, planets } = stellarStore;

  // 선택된 객체 찾기 (STAR 우선, 없으면 PLANET 검색)
  const selection =
    star && star.id === selectedObjectId
      ? { kind: 'STAR' as const, obj: star }
      : (() => {
          const p = planets.find((o) => o.id === selectedObjectId);
          return p ? { kind: 'PLANET' as const, obj: p } : null;
        })();

  const isPlanet = selection?.kind === 'PLANET';
  const starObj =
    selection?.kind === 'STAR' ? (selection.obj as Star) : undefined;
  const planetObj =
    selection?.kind === 'PLANET' ? (selection.obj as Planet) : undefined;
  const properties = isPlanet ? planetObj?.properties : starObj?.properties;
  const currentRole = planetObj?.role;
  const synthProfiles = currentRole ? getSynthProfilesForRole(currentRole) : [];
  const oscillatorCatalog = getAvailableOscillatorOptions();
  const resolvedSynthType = currentRole
    ? (planetObj?.synthType ?? getDefaultSynthType(currentRole))
    : undefined;
  const oscillatorOptions =
    currentRole && resolvedSynthType
      ? (() => {
          const preset = synthProfiles.find(
            (profile) => profile.id === resolvedSynthType
          );
          if (preset?.oscillatorSuggestions?.length) {
            return oscillatorCatalog.filter((option) =>
              preset.oscillatorSuggestions!.includes(option.id)
            );
          }
          return oscillatorCatalog;
        })()
      : oscillatorCatalog;
  const resolvedOscillatorType =
    currentRole && resolvedSynthType
      ? (planetObj?.oscillatorType ??
        getDefaultOscillatorType(currentRole, resolvedSynthType))
      : undefined;

  // 선택된 행성의 재생 상태 확인 및 업데이트
  useEffect(() => {
    if (isPlanet && selectedObjectId) {
      const audioPlanet = system.getPlanet(selectedObjectId);
      setIsPlanetPlaying(audioPlanet?.isPlaying || false);
    }
  }, [isPlanet, selectedObjectId, system]);

  // 행성 패턴 재생/정지 토글
  const handleTogglePlanetPattern = useCallback(async () => {
    if (!isPlanet || !selectedObjectId) return;

    try {
      const willPlay = await system.togglePlanetPattern(selectedObjectId);
      setIsPlanetPlaying(willPlay);
      console.log(
        `🎵 ${planetObj?.role || 'Planet'} ${willPlay ? '재생 시작' : '정지'}`
      );
    } catch (error) {
      console.error('행성 패턴 토글 실패:', error);
    }
  }, [isPlanet, selectedObjectId, system, planetObj?.role]);

  const handleSynthTypeChange = useCallback(
    (nextSynth: SynthTypeId) => {
      if (!isPlanet || !selectedObjectId || !planetObj) return;
      const defaultOsc = getDefaultOscillatorType(planetObj.role, nextSynth);
      setStellarStore({
        ...stellarStore,
        planets: stellarStore.planets.map((planet) =>
          planet.id === selectedObjectId
            ? {
                ...planet,
                synthType: nextSynth,
                oscillatorType: defaultOsc,
              }
            : planet
        ),
      });
    },
    [isPlanet, selectedObjectId, planetObj, setStellarStore, stellarStore]
  );

  const handleOscillatorChange = useCallback(
    (nextOsc: OscillatorTypeId) => {
      if (!isPlanet || !selectedObjectId) return;
      setStellarStore({
        ...stellarStore,
        planets: stellarStore.planets.map((planet) =>
          planet.id === selectedObjectId
            ? { ...planet, oscillatorType: nextOsc }
            : planet
        ),
      });
    },
    [isPlanet, selectedObjectId, setStellarStore, stellarStore]
  );

  if (!selection || !properties) return null;

  return (
    <div className="space-y-6">
      {/* PLANET DETAILS */}
      {isPlanet && (
        <div>
          <div className="Properties-Header flex items-center justify-between mb-4">
            <PanelTitle
              className="text-[16px] mb-0"
              textColor="text-secondary-300"
            >
              PLANET DETAILS
            </PanelTitle>
            <RandomInstrument planetId={selectedObjectId} />
          </div>

          <Card className="p-[17px] space-y-4">
            {/* 행성 재생 컨트롤 */}
            <div>
              <p className="text-text-muted text-xs mb-2">PLAYBACK</p>
              <Button
                color={isPlanetPlaying ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleTogglePlanetPattern}
                className="text-xs"
              >
                {isPlanetPlaying ? '⏸️ STOP' : '▶️ PLAY'}
              </Button>
            </div>

            {/* 악기 타입 선택 */}
            <div>
              <p className="text-text-muted text-xs mb-2">SOUND TYPE</p>
              <div className="flex gap-2 flex-wrap">
                {soundTypeList.map((soundType) => (
                  <Button
                    key={soundType}
                    color="tertiary"
                    size="xs"
                    className="text-xs"
                    onClick={() => {
                      setStellarStore({
                        ...stellarStore,
                        planets: stellarStore.planets.map((planet) => {
                          if (planet.id === selectedObjectId) {
                            const nextSynth = getDefaultSynthType(soundType);
                            return {
                              ...planet,
                              role: soundType,
                              synthType: nextSynth,
                              oscillatorType: getDefaultOscillatorType(
                                soundType,
                                nextSynth
                              ),
                            };
                          }
                          return planet;
                        }),
                      });
                    }}
                    clicked={planetObj?.role === soundType}
                  >
                    {soundType}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-[17px] space-y-4 mt-4">
            <div>
              <p className="text-text-muted text-xs mb-2">SYNTH TYPE</p>
              <div className="flex gap-2 flex-wrap">
                {synthProfiles.map((profile) => (
                  <Button
                    key={profile.id}
                    color="tertiary"
                    size="xs"
                    className="text-xs"
                    onClick={() => handleSynthTypeChange(profile.id)}
                    clicked={resolvedSynthType === profile.id}
                  >
                    {profile.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-muted text-xs mb-2">OSCILLATOR</p>
              <div className="flex gap-2 flex-wrap">
                {oscillatorOptions.map((option) => (
                  <Button
                    key={option.id}
                    color="tertiary"
                    size="xs"
                    className="text-xs"
                    onClick={() => handleOscillatorChange(option.id)}
                    clicked={resolvedOscillatorType === option.id}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PROPERTIES */}
      <div>
        <div className="Properties-Header flex justify-between items-center mb-4">
          <PanelTitle className="mb-0 text-[16px]" textColor="text-primary-300">
            PROPERTIES
          </PanelTitle>
          <RandomProperties target={isPlanet ? planetObj! : starObj!} />
        </div>

        <ControlPanel target={isPlanet ? planetObj! : starObj!} />
      </div>
    </div>
  );
}
