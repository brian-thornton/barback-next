"use client";
import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import styles from "./BourbonSelector.module.css";
import { Bourbon } from "@/types/bourbon-types";

interface BourbonSelectorProps {
  onBourbonSelect: (bourbon: Bourbon) => void;
  selectedBourbon?: Bourbon | null;
  placeholder?: string;
}

const BourbonSelector = ({ onBourbonSelect, selectedBourbon, placeholder = "Search for a bourbon..." }: BourbonSelectorProps) => {
  const [query, setQuery] = useState("");
  const [bourbons, setBourbons] = useState<Bourbon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    region: "",
    price: "",
    age: ""
  });

  const searchBourbons = useCallback(async (searchQuery: string, searchFilters = filters) => {
    if (searchQuery.length < 2) {
      setBourbons([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: "20"
      });

      // Add filters
      if (searchFilters.category) params.append("category", searchFilters.category);
      if (searchFilters.region) params.append("region", searchFilters.region);
      if (searchFilters.price) params.append("price", searchFilters.price);
      if (searchFilters.age) params.append("age", searchFilters.age);

      const response = await fetch(`/api/bourbons?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search bourbons: ${response.status}`);
      }

      const result = await response.json();
      setBourbons(result.data || []);
    } catch (err) {
      console.error("Error searching bourbons:", err);
      setError("Failed to search bourbons. Please try again.");
      setBourbons([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchBourbons(query);
      } else {
        setBourbons([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchBourbons]);

  const handleBourbonSelect = (bourbon: Bourbon) => {
    onBourbonSelect(bourbon);
    setQuery(bourbon.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setBourbons([]);
    onBourbonSelect(null);
    setIsOpen(false);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (query.trim()) {
      searchBourbons(query, newFilters);
    }
  };

  const getPriceColor = (price: string) => {
    switch (price.toLowerCase()) {
      case 'low': return '#4ade80';
      case 'medium': return '#fbbf24';
      case 'high': return '#f87171';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={styles.searchInput}
          />
          {query && (
            <button
              onClick={handleClear}
              className={styles.clearButton}
              type="button"
            >
              <FiX />
            </button>
          )}
        </div>
        
        {isOpen && (
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Categories</option>
                <option value="bourbon">Bourbon</option>
                <option value="rye">Rye</option>
                <option value="tennessee whiskey">Tennessee Whiskey</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="region-filter">Region:</label>
              <select
                id="region-filter"
                value={filters.region}
                onChange={(e) => handleFilterChange("region", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Regions</option>
                <option value="kentucky">Kentucky</option>
                <option value="tennessee">Tennessee</option>
                <option value="vermont">Vermont</option>
                <option value="utah">Utah</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="price-filter">Price:</label>
              <select
                id="price-filter"
                value={filters.price}
                onChange={(e) => handleFilterChange("price", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Prices</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="age-filter">Age:</label>
              <select
                id="age-filter"
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Ages</option>
                <option value="no age statement">No Age Statement</option>
                <option value="4 years">4+ Years</option>
                <option value="10 years">10+ Years</option>
                <option value="15 years">15+ Years</option>
                <option value="20 years">20+ Years</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.resultsContainer}>
          {isLoading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <span>Searching bourbons...</span>
            </div>
          )}

          {error && (
            <div className={styles.errorContainer}>
              <span className={styles.errorText}>{error}</span>
            </div>
          )}

          {!isLoading && !error && bourbons.length === 0 && query.length >= 2 && (
            <div className={styles.noResultsContainer}>
              <span>No bourbons found matching your search. Add new items manually to build your database.</span>
            </div>
          )}

          {!isLoading && !error && bourbons.length > 0 && (
            <div className={styles.bourbonList}>
              {bourbons.map((bourbon) => (
                <div
                  key={bourbon.id}
                  onClick={() => handleBourbonSelect(bourbon)}
                  className={styles.bourbonItem}
                >
                  <div className={styles.bourbonInfo}>
                    <div className={styles.bourbonName}>{bourbon.name}</div>
                    <div className={styles.bourbonDetails}>
                      <span className={styles.distiller}>{bourbon.distiller}</span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.region}>{bourbon.region}</span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.abv}>{bourbon.abv}</span>
                    </div>
                    <div className={styles.bourbonMeta}>
                      <span 
                        className={styles.priceTag}
                        style={{ backgroundColor: getPriceColor(bourbon.price) }}
                      >
                        {bourbon.price}
                      </span>
                      <span className={styles.age}>{bourbon.age}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedBourbon && (
        <div className={styles.selectedBourbon}>
          <div className={styles.selectedBourbonInfo}>
            <div className={styles.selectedBourbonName}>{selectedBourbon.name}</div>
            <div className={styles.selectedBourbonDetails}>
              {selectedBourbon.distiller} • {selectedBourbon.region} • {selectedBourbon.abv}
            </div>
          </div>
          <button
            onClick={handleClear}
            className={styles.removeSelectedButton}
            type="button"
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
};

export default BourbonSelector;
