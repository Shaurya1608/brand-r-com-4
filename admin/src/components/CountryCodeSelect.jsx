"use client";

import React, { useState, useRef, useEffect } from "react";
import { COUNTRY_CODES } from "../utils/countryCodes";

export default function CountryCodeSelect({ value = "+91", onChange, name = "countryCode", className = "", buttonStyle = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selected = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 230);
    }
    setIsOpen(!isOpen);
  };

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    onChange({ target: { name, value: code } });
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={buttonStyle || "flex items-center justify-between gap-1 px-2.5 py-2.5 border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold text-[13px] transition-all cursor-pointer min-w-[82px] shadow-sm"}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{selected.flag}</span>
          <span className="text-[12px] font-bold">{selected.code}</span>
        </span>
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 z-[300] w-52 max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl p-1.5 text-[12px] ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <div className="p-1 mb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
            <input
              type="text"
              placeholder="Search code or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-[11px] border border-gray-200 rounded focus:outline-none focus:border-[#5e8e33] bg-gray-50 text-gray-800"
              autoFocus
            />
          </div>
          {filtered.length === 0 ? (
            <div className="px-2 py-2 text-[11px] text-gray-400 text-center">No matching country</div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.code + c.country}
                onClick={() => handleSelect(c.code)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selected.code === c.code && selected.country === c.country
                    ? "bg-[#5e8e33]/10 text-[#5e8e33] font-bold"
                    : "hover:bg-gray-100 text-gray-700 font-medium"
                }`}
              >
                <span className="flex items-center gap-2 truncate pr-1">
                  <span className="text-sm">{c.flag}</span>
                  <span className="truncate max-w-[100px] text-[11px]">{c.name.split(" (")[0]}</span>
                </span>
                <span className="font-mono text-gray-500 font-semibold text-[11px] shrink-0">{c.code}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
