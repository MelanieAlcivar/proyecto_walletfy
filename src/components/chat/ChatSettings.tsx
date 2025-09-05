import React from 'react';
import { X, Info } from 'lucide-react';
import { LLMConfig } from '../../types/chat';

interface ChatSettingsProps {
  config: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
  onClose: () => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({ config, onConfigChange, onClose }) => {
  const handleChange = (key: keyof LLMConfig, value: number | string) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Configuración del Modelo
          </h4>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modelo
            </label>
            <select
              value={config.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Temperatura: {config.temperature}
              </label>
              <div className="group relative">
                <Info className="w-3 h-3 text-gray-400" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Controla la creatividad (0.0 = conservador, 1.0 = creativo)
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Top P: {config.topP}
              </label>
              <div className="group relative">
                <Info className="w-3 h-3 text-gray-400" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Controla la diversidad de respuestas
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={config.topP}
              onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Máx. Tokens: {config.maxTokens}
              </label>
              <div className="group relative">
                <Info className="w-3 h-3 text-gray-400" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Longitud máxima de la respuesta
                </div>
              </div>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={config.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;