'use client';

import React, { useState } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { ChurnRiskBadge } from './ChurnRiskBadge';
import { RetentionCampaignDrawer } from './RetentionCampaignDrawer';
import { Search, Filter, AlertTriangle, ShieldAlert, Sparkles, Mail, Phone, UserCheck, Flame } from 'lucide-react';
import { GymMember } from '@/lib/store/types';

export function MemberRadarTable() {
  const { members, launchRetentionCampaign } = useGymStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredMembers = members.filter((member) => {
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterRisk !== 'all' && member.riskLevel !== filterRisk) return false;
    if (filterTier !== 'all' && member.tier !== filterTier) return false;
    return true;
  });

  const highRiskMembers = members.filter((m) => m.riskLevel === 'high' || m.riskLevel === 'critical');

  const handleQuickRetentionBlast = () => {
    const targetIds = highRiskMembers.map((m) => m.id);
    launchRetentionCampaign(targetIds, 'smoothie_voucher', 25);
  };

  return (
    <div className="space-y-4">
      {/* Controls & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-100/60 p-3.5 rounded-2xl border border-border-subtle backdrop-blur-md">
        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-200 border border-border-subtle text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-stark-orange"
          />
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-border-subtle">
          {['all', 'critical', 'high', 'medium', 'low'].map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                filterRisk === risk
                  ? 'bg-stark-orange text-black shadow-stark-glow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>

        {/* Quick Campaign Action */}
        <button
          onClick={handleQuickRetentionBlast}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-stark-orange hover:bg-stark-orange/90 text-black border border-stark-orange/50 shadow-stark-glow-sm transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Trigger Retention Blast ({highRiskMembers.length} At-Risk)
        </button>
      </div>

      {/* Members Radar Data Table */}
      <div className="stark-card rounded-2xl overflow-hidden border border-border-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-200/90 text-gray-400 border-b border-border-subtle uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Member Identity</th>
                <th className="p-3.5">Membership Tier</th>
                <th className="p-3.5">Churn Probability</th>
                <th className="p-3.5">Last Visit</th>
                <th className="p-3.5">Monthly Value</th>
                <th className="p-3.5">Favorite Discipline</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-surface-100/50 transition-colors">
                  {/* Identity */}
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-border-subtle shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{member.name}</div>
                      <div className="text-[10px] text-gray-400">{member.id} • {member.email}</div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      member.tier === 'executive'
                        ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                        : member.tier === 'premium_black'
                        ? 'bg-stark-orange/15 text-stark-orange border-stark-orange/30'
                        : 'bg-surface-100 text-gray-300 border-border-subtle'
                    }`}>
                      {member.tier.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Churn Risk */}
                  <td className="p-3.5">
                    <ChurnRiskBadge score={member.churnRiskScore} riskLevel={member.riskLevel} />
                  </td>

                  {/* Last Visit */}
                  <td className="p-3.5 text-gray-300">
                    <span className={member.lastVisitDaysAgo >= 10 ? 'text-stark-red font-bold' : 'text-gray-300'}>
                      {member.lastVisitDaysAgo === 0 ? 'Today' : `${member.lastVisitDaysAgo} days ago`}
                    </span>
                  </td>

                  {/* Monthly Spend */}
                  <td className="p-3.5 font-bold text-white">
                    ${member.monthlySpend}/mo
                  </td>

                  {/* Favorite Class */}
                  <td className="p-3.5 text-gray-400 max-w-[160px] truncate">
                    {member.favoriteClass}
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => launchRetentionCampaign([member.id], 'smoothie_voucher', 20)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-surface-100 hover:bg-stark-orange hover:text-black border border-border-subtle hover:border-stark-orange text-gray-300 transition-colors"
                    >
                      Draft Perk
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Campaign Drawer */}
      <RetentionCampaignDrawer />
    </div>
  );
}
