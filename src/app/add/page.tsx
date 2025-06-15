'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { bourbonApi } from '@/lib/bourbon-api';
import { Bourbon } from '@/data/bourbons';
import Image from 'next/image';

export default function AddPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Bourbon[]>([]);
  const [activeTab, setActiveTab] = useState('bourbons');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const handleImageError = (bourbonId: string) => {
    setImageErrors(prev => ({ ...prev, [bourbonId]: true }));
  };

  const searchBourbons = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await bourbonApi.search({ query });
      setSearchResults(result.data);
      setTotalResults(result.total);
      setPage(1);
    } catch (err) {
      setError('Failed to search bourbons. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'bourbons') {
      searchBourbons(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const loadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await bourbonApi.search({
        query: searchQuery,
        page: nextPage,
        limit: 20
      });

      setSearchResults(prev => [...prev, ...result.data]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more:', error);
      setError('Failed to load more results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add to Your Bourbon Collection</h1>
      
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button
            className={`${styles.tabTrigger} ${activeTab === 'bourbons' ? styles.active : ''}`}
            onClick={() => setActiveTab('bourbons')}
          >
            Bourbons
          </button>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by bourbon name, distiller, or category..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.searchButton} 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {activeTab === 'bourbons' && (
          <>
            <div className={styles.grid}>
              {searchResults.map((bourbon) => (
                <div key={bourbon.id} className={styles.resultItem}>
                  <div className={styles.resultImage}>
                    <Image
                      src={bourbon.image || '/placeholder-bourbon.jpg'}
                      alt={bourbon.name}
                      width={100}
                      height={100}
                      onError={() => handleImageError(bourbon.id)}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.resultInfo}>
                    <h3>{bourbon.name}</h3>
                    <p>{bourbon.description}</p>
                    {bourbon.category && <p>Category: {bourbon.category}</p>}
                    {bourbon.distiller !== 'Unknown' && <p>Distiller: {bourbon.distiller}</p>}
                    {bourbon.abv !== 'Unknown' && <p>ABV: {bourbon.abv}</p>}
                    {bourbon.region !== 'Unknown' && <p>Region: {bourbon.region}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            {searchResults.length > 0 && searchResults.length < totalResults && (
              <div className={styles.loadMoreContainer}>
                <button 
                  className={styles.loadMoreButton}
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 