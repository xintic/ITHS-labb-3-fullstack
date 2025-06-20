import { useEffect, useState } from 'react';
import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

interface AttributeValue {
  value_id: number;
  value: string;
  attribute_name: string;
}

interface Props {
  categoryId: number;
  selectedValues: number[];
  onChange: (selected: number[]) => void;
}

const priceRanges = [
  { label: '1–100 kr', min: 1, max: 100 },
  { label: '100–250 kr', min: 100, max: 250 },
  { label: '250–500 kr', min: 250, max: 500 },
  { label: '500–1000 kr', min: 500, max: 1000 },
  { label: '1000+ kr', min: 1001, max: Infinity }
];

const ProductFilter = ({ categoryId, selectedValues, onChange }: Props) => {
  const [attributes, setAttributes] = useState<Record<string, AttributeValue[]>>({});

  useEffect(() => {
    axios
      .get(`/api/products/filters/${categoryId}`)
      .then((res) => {
        const grouped: Record<string, AttributeValue[]> = {};
        res.data.forEach((item: AttributeValue) => {
          if (!grouped[item.attribute_name]) {
            grouped[item.attribute_name] = [];
          }
          grouped[item.attribute_name].push(item);
        });
        setAttributes(grouped);
      })
      .catch((err) => console.error('Kunde inte hämta filterattribut', err));
  }, [categoryId]);

  const toggleValue = (valueId: number) => {
    if (selectedValues.includes(valueId)) {
      onChange(selectedValues.filter((id) => id !== valueId));
    } else {
      onChange([...selectedValues, valueId]);
    }
  };

  const resetFilters = () => {
    onChange([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Filtrera</h2>
        <Button size="sm" onClick={resetFilters}>
          Återställ
        </Button>
      </div>

      <Accordion type="multiple">
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Pris</AccordionTrigger>
          <AccordionContent className="space-y-2 mt-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center space-x-2 text-sm">
                <Checkbox
                  checked={selectedValues.includes(-range.min)}
                  onCheckedChange={() => toggleValue(-range.min)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        {Object.entries(attributes).map(([attribute, values]) => (
          <AccordionItem key={attribute} value={attribute}>
            <AccordionTrigger className="text-sm font-medium">{attribute}</AccordionTrigger>
            <AccordionContent className="space-y-2 mt-2">
              {values.map((val) => (
                <label key={val.value_id} className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={selectedValues.includes(val.value_id)}
                    onCheckedChange={() => toggleValue(val.value_id)}
                  />
                  <span>{val.value}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProductFilter;
