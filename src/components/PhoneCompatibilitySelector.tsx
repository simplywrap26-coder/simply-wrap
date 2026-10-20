import { useMemo } from 'react';
import type { PhoneModel } from '../types';
import { uniqueBrands } from '../utils/compat';
import SearchableSelect from './SearchableSelect';

interface Props {
  models: PhoneModel[]; brand: string; model: string;
  onBrand: (b: string) => void; onModel: (m: string) => void;
  errors: { brand?: string; model?: string };
}

export default function PhoneCompatibilitySelector({ models, brand, model, onBrand, onModel, errors }: Props) {
  const brands = useMemo(() => uniqueBrands(models), [models]);
  const modelNames = useMemo(() => models.filter((m) => m.brand === brand).map((m) => m.name), [models, brand]);

  if (models.length === 0) {
    return <p className="border border-mist bg-sand/50 p-4 text-sm text-stone">This wrap has no compatible phones set up yet, so it can't be ordered.</p>;
  }
  return (
    <div className="space-y-4">
      <SearchableSelect label="Choose your phone brand" options={brands} value={brand} placeholder="Select brand"
        onChange={(b) => { onBrand(b); onModel(''); /* changing brand resets model */ }} error={errors.brand} />
      <SearchableSelect label="Choose your phone model" options={modelNames} value={model} disabled={!brand}
        placeholder={brand ? 'Search models' : 'Select a brand first'} onChange={onModel} error={errors.model} />
    </div>
  );
}
