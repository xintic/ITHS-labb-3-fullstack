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
