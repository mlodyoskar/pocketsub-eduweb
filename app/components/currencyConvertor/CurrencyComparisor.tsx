import { ExchangeRate } from "@/app/types/Currencies";

type CurrencyComparisorProps = {
  currencyRates: ExchangeRate;
};

const baseCurrency = "GBP";

const CurrencyComparisor = ({ currencyRates }: CurrencyComparisorProps) => {
  const renderCurrencyList = () => {
    return Object.entries(currencyRates)
      .filter(([currency]) => currency !== baseCurrency) // Exclude the base currency
      .map(([currency, rate]) => (
        <li
          className="text-1xl flex items-center gap-1 text-cyan-500"
          key={currency}
        >
          <h3 className="font-semibold">1 {baseCurrency}</h3>
          <span className="inline-block">=</span>
          <p className="font-medium">
            {rate.toFixed(2)} {currency}
          </p>
        </li>
      ));
  };
  return (
    <ul className="flex items-center justify-center gap-4">
      {renderCurrencyList()}
    </ul>
  );
};

export default CurrencyComparisor;
