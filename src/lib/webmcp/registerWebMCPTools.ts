import {
  UPDATE_GYM_FLOOR_EQUIPMENT_TOOL,
  MANAGE_CLASS_SCHEDULE_TOOL,
  QUERY_MEMBER_COHORTS_TOOL,
  LAUNCH_RETENTION_CAMPAIGN_TOOL,
  SIMULATE_REVENUE_FORECAST_TOOL,
  GET_FACILITY_TELEMETRY_TOOL,
} from './schemas';
import {
  handleUpdateGymFloorEquipment,
  handleManageClassSchedule,
  handleQueryMemberCohorts,
  handleLaunchRetentionCampaign,
  handleSimulateRevenueForecast,
  handleGetFacilityTelemetry,
  WebMCPResult,
} from './toolHandlers';

// Standard WebMCP DOM extension declaration
declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: {
        name: string;
        description: string;
        inputSchema: Record<string, unknown>;
        execute: (input: unknown) => Promise<WebMCPResult>;
      }) => void;
    };
  }

  interface Window {
    __webmcp_registered_tools?: Record<
      string,
      (input: unknown) => Promise<WebMCPResult>
    >;
  }
}

/**
 * Registers all 6 official WebMCP tools on document.modelContext
 * to expose them to browser-native AI agents and Chrome WebMCP extensions.
 */
export function registerAllWebMCPTools(): void {
  if (typeof window === 'undefined') return;

  if (!window.__webmcp_registered_tools) {
    window.__webmcp_registered_tools = {};
  }

  const toolsToRegister = [
    {
      def: UPDATE_GYM_FLOOR_EQUIPMENT_TOOL,
      handler: handleUpdateGymFloorEquipment,
    },
    {
      def: MANAGE_CLASS_SCHEDULE_TOOL,
      handler: handleManageClassSchedule,
    },
    {
      def: QUERY_MEMBER_COHORTS_TOOL,
      handler: handleQueryMemberCohorts,
    },
    {
      def: LAUNCH_RETENTION_CAMPAIGN_TOOL,
      handler: handleLaunchRetentionCampaign,
    },
    {
      def: SIMULATE_REVENUE_FORECAST_TOOL,
      handler: handleSimulateRevenueForecast,
    },
    {
      def: GET_FACILITY_TELEMETRY_TOOL,
      handler: handleGetFacilityTelemetry,
    },
  ];

  toolsToRegister.forEach(({ def, handler }) => {
    const toolObj = {
      name: def.name,
      description: def.description,
      inputSchema: def.inputSchema,
      execute: handler,
    };

    // 1. Register on official document.modelContext standard
    if (typeof document !== 'undefined' && document.modelContext?.registerTool) {
      try {
        document.modelContext.registerTool(toolObj);
      } catch (err) {
        console.warn(`[WebMCP] Failed registering ${def.name} on document.modelContext`, err);
      }
    }

    // 2. Attach to window object for fallback / browser console testing
    window.__webmcp_registered_tools![def.name] = handler;
  });

  console.log('[WebMCP] Successfully registered all 6 official WebMCP tools into DOM context.');
}
