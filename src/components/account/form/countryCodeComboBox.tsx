"use client";

import React, { useState, useEffect } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export interface CountryCodeObject {
  name: string; // e.g. "Canada"
  cca3: string; // e.g. "CAN"
  root: string; // e.g. "+1"
}

interface RawApiCountry {
  name: { common: string };
  cca3: string;
  idd: { root: string; suffixes?: string[] };
  flag: string; // e.g. "🇨🇦"
}

interface CountryCodeComboBoxProps {
  value: CountryCodeObject | null;
  onChange: (val: CountryCodeObject | null) => void;
  error?: boolean;
}

const CountryCodeComboBox: React.FC<CountryCodeComboBoxProps> = ({
  value,
  onChange,
  error = false,
}) => {
  const [items, setItems] = useState<RawApiCountry[]>([]);
  const [query, setQuery] = useState("");

  // Convert a raw item to your form object
  const toCodeObject = (c: RawApiCountry): CountryCodeObject => ({
    name: c.name.common,
    cca3: c.cca3,
    root: c.idd.root,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/alpha?codes=us,ca&status=true&fields=name,flag,idd,cca3",
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = (await res.json()) as RawApiCountry[];
        setItems(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    }

    fetchData();
  }, []);

  const filtered = items.filter((item) => {
    if (!query) return true;
    const nameMatch = item.name.common
      .toLowerCase()
      .includes(query.toLowerCase());
    const rootMatch = item.idd.root.includes(query);
    return nameMatch || rootMatch;
  });

  const selectedItem = value
    ? items.find((i) => i.cca3 === value.cca3 && i.idd.root === value.root)
    : null;

  const handleSelect = (item: RawApiCountry | null) => {
    if (!item) {
      onChange(null);
    } else {
      onChange(toCodeObject(item));
    }
    setQuery("");
  };

  return (
    <div>
      <Combobox value={selectedItem || null} onChange={handleSelect}>
        <Combobox.Label className="block text-gray-700 mb-1">
          Country Code
        </Combobox.Label>
        <div className="relative">
          <ComboboxInput
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
            placeholder="Search country name or code..."
            onChange={(e) => setQuery(e.target.value)}
            displayValue={(item: RawApiCountry | null) => {
              if (item) {
                return `${item.idd.root} ${item.name.common}`;
              }
              if (value) {
                return `${value.root} ${value.name}`;
              }
              return "";
            }}
          />

          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="h-4 w-4 text-gray-400"
            />
          </ComboboxButton>

          {filtered.length > 0 && (
            <ComboboxOptions
              className="
                absolute z-10 mt-1 max-h-60 w-full
                overflow-auto rounded-md bg-white py-1 text-base
                shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm
              "
            >
              {filtered.map((c) => (
                <ComboboxOption
                  key={c.cca3 + c.idd.root}
                  value={c}
                  className="
                    group relative cursor-default select-none
                    py-2 pl-3 pr-8 text-gray-900
                    data-[focus]:bg-indigo-600 data-[focus]:text-white
                    data-[focus]:outline-none
                  "
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{c.flag}</span>
                    <span className="truncate group-data-[selected]:font-semibold">
                      {c.idd.root} {c.name.common}
                    </span>
                  </div>
                  <span
                    className="
                      absolute inset-y-0 right-0 hidden items-center pr-4
                      text-indigo-600 group-data-[selected]:flex
                      group-data-[focus]:text-white
                    "
                  >
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                  </span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
    </div>
  );
};

export default CountryCodeComboBox;
