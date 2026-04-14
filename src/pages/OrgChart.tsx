import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, Maximize2, Minimize2 } from 'lucide-react';
import { useEmployees } from '../hooks';
import { buildOrgTree } from '../utils';
import OrgChartNode from '../components/OrgChartNode';

/**
 * Collects all node IDs in a tree, used for expand-all.
 */
function collectAllIds(roots: ReturnType<typeof buildOrgTree>): string[] {
  const ids: string[] = [];
  function walk(nodes: ReturnType<typeof buildOrgTree>) {
    for (const n of nodes) {
      ids.push(n.employee.id);
      walk(n.children);
    }
  }
  walk(roots);
  return ids;
}

/**
 * Finds all ancestor IDs for a given employee ID so we can auto-expand
 * the path to a highlighted node.
 */
function findAncestorIds(
  employees: { id: string; managerId: string | null }[],
  targetId: string,
): string[] {
  const parentMap = new Map<string, string | null>();
  for (const emp of employees) parentMap.set(emp.id, emp.managerId);

  const ancestors: string[] = [];
  let current: string | null = targetId;
  while (current) {
    ancestors.push(current);
    const parent = parentMap.get(current) ?? null;
    if (!parent || !parentMap.has(parent)) break;
    current = parent;
  }
  return ancestors;
}

export default function OrgChart() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const { employees } = useEmployees();
  const roots = useMemo(() => buildOrgTree(employees), [employees]);

  // Initially expand top 2 levels + ancestors of highlighted node
  const defaultExpanded = useMemo(() => {
    const set = new Set<string>();

    // Always expand the first 2 levels for context
    for (const root of roots) {
      set.add(root.employee.id);
      for (const child of root.children) {
        set.add(child.employee.id);
      }
    }

    // If a node is highlighted, expand all its ancestors
    if (highlightId) {
      for (const id of findAncestorIds(employees, highlightId)) {
        set.add(id);
      }
    }

    return set;
  }, [roots, highlightId, employees]);

  const [expandedSet, setExpandedSet] = useState<Set<string>>(defaultExpanded);

  const onToggle = useCallback((id: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = () => {
    setExpandedSet(new Set(collectAllIds(roots)));
  };

  const collapseAll = () => {
    // Keep only root-level nodes expanded
    setExpandedSet(new Set(roots.map((r) => r.employee.id)));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-end justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <Network size={20} className="text-neutral-600" />
            <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">Organization Chart</h1>
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">
            Reporting hierarchy across {employees.length} employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg text-neutral-600 hover:bg-stone-50 transition-colors"
          >
            <Maximize2 size={12} /> Expand All
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg text-neutral-600 hover:bg-stone-50 transition-colors"
          >
            <Minimize2 size={12} /> Collapse
          </button>
        </div>
      </motion.div>

      {/* Chart canvas — horizontally scrollable */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
        <div className="min-w-max px-10 py-10">
          {/* Render each root tree */}
          <div className="flex flex-col items-center gap-12">
            {roots.map((root) => (
              <OrgChartNode
                key={root.employee.id}
                node={root}
                depth={0}
                highlightId={highlightId}
                expandedSet={expandedSet}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-[11px] text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" /> Inactive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> On Leave
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500" /> Probation
        </span>
        <span className="flex items-center gap-1.5">
          Click node to expand · Hover for detail link
        </span>
      </div>
    </div>
  );
}
