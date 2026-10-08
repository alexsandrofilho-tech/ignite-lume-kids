import { type ReactNode, useState } from 'react';
import { BookOpen, Compass, Heart, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CharacterActivities } from './CharacterActivities';
import { characterContent } from '@/lib/character-content';
import type { CharKey } from '@/lib/progress';

export function CharacterTabs({ character, children, value, onValueChange }: { character: CharKey; children: ReactNode; value?: string; onValueChange?: (value: string) => void }) {
  const [tab, setTab] = useState('overview');
  const content = characterContent[character];
  const tabs = [{ id: 'overview', label: 'Meu mundo' }, ...content.tabs, { id: 'about', label: `Sobre ${content.name}` }];
  return <Tabs value={value ?? tab} onValueChange={onValueChange ?? setTab} className={`world-${character}`}>
    <div className="px-6 mb-5"><div className="overflow-x-auto no-scrollbar pb-1"><TabsList aria-label={`Atividades de ${content.name}`} className="world-tabs h-auto min-w-full justify-start gap-1 p-1">{tabs.map((item, i) => { const Icon = i === 0 ? Compass : i === tabs.length - 1 ? Heart : i === 1 ? BookOpen : Sparkles; return <TabsTrigger key={item.id} value={item.id} className="world-tab min-h-11 gap-1.5 px-3 text-xs font-bold"><Icon className="size-3.5 shrink-0" />{item.label}</TabsTrigger>; })}</TabsList></div></div>
    <TabsContent value="overview" className="mt-0">{children}</TabsContent>
    {tabs.slice(1).map(item => <TabsContent key={item.id} value={item.id} className="px-6 mt-0 pb-8"><CharacterActivities character={character} tab={item.id} /></TabsContent>)}
  </Tabs>;
}