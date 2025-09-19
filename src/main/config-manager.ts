import fs from 'fs';
import path from 'path';
import os from 'os';
import YAML from 'yaml';

export interface AppConfig {
  summoner_name: string;
  region: string;
  use_live_client: boolean;
  riot_api_key: string;
  update_interval_seconds: number;
  tts_enabled: boolean;
  telemetry_enabled: boolean;
  overlay_enabled: boolean;
  jungle_tracking: {
    camp_prediction_enabled: boolean;
    enemy_estimation_enabled: boolean;
    scuttle_priority_alerts: boolean;
    pathing_suggestions: boolean;
  };
  overlay: {
    show_next_camp: boolean;
    show_scuttle_priority: boolean;
    show_recommendations: boolean;
    show_objective_timers: boolean;
    compact_mode: boolean;
  };
}

const defaultConfig: AppConfig = {
  summoner_name: "",
  region: "EUW1", 
  use_live_client: true,
  riot_api_key: "",
  update_interval_seconds: 3,
  tts_enabled: true,
  telemetry_enabled: false,
  overlay_enabled: true,
  jungle_tracking: {
    camp_prediction_enabled: true,
    enemy_estimation_enabled: true,
    scuttle_priority_alerts: true,
    pathing_suggestions: true
  },
  overlay: {
    show_next_camp: true,
    show_scuttle_priority: true,
    show_recommendations: true,
    show_objective_timers: true,
    compact_mode: false
  }
};

export class ConfigManager {
  private configPath: string;
  private config: AppConfig = defaultConfig;

  constructor() {
    const baseDir = process.platform === 'win32'
      ? path.join(process.env.APPDATA || '', 'lol-jungle-assistant')
      : path.join(os.homedir(), '.config', 'lol-jungle-assistant');
    
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    
    this.configPath = path.join(baseDir, 'config.yaml');
  }

  async loadConfig(): Promise<AppConfig> {
    if (fs.existsSync(this.configPath)) {
      try {
        const configText = fs.readFileSync(this.configPath, 'utf-8');
        const loadedConfig = YAML.parse(configText);
        this.config = { ...defaultConfig, ...loadedConfig };
      } catch (error) {
        console.warn('Failed to load config, using defaults:', error);
        this.config = defaultConfig;
      }
    } else {
      fs.writeFileSync(this.configPath, YAML.stringify(defaultConfig));
      this.config = defaultConfig;
    }
    
    return this.config;
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AppConfig>): AppConfig {
    this.config = { ...this.config, ...updates };
    fs.writeFileSync(this.configPath, YAML.stringify(this.config));
    return this.config;
  }

  getConfigPath(): string {
    return this.configPath;
  }
}
