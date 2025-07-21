import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setBalanceInicial } from '../store/slices/eventsSlice';
import { formatCurrency } from '../utils/calculations';

const BalanceInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const balanceInicial = useAppSelector(state => state.events.balanceInicial);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    dispatch(setBalanceInicial(value));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label
          htmlFor="balance-inicial"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Balance Inicial:
        </label>
        <div className="flex items-center gap-2">
          <input
            id="balance-inicial"
            type="number"
            value={balanceInicial}
            onChange={handleBalanceChange}
            min="0"
            step="0.01"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(balanceInicial)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceInput;