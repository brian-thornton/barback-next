'use client';

import { useState } from 'react';
import styles from './page.module.css';
import BourbonSelector from '@/components/BourbonSelector/BourbonSelector';
import { Bourbon } from '@/types/bourbon-types';

export default function AddPage() {
  const [selectedBourbon, setSelectedBourbon] = useState<Bourbon | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualBourbon, setManualBourbon] = useState<Partial<Bourbon>>({
    name: '',
    distiller: '',
    abv: '',
    region: '',
    category: 'Bourbon',
    price: 'Medium',
    age: 'No age statement',
  });

  const handleBourbonSelect = (bourbon: Bourbon | null) => {
    setSelectedBourbon(bourbon);
    setIsManualEntry(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBourbon.name || !manualBourbon.distiller) {
      alert('Please fill in at least Name and Distiller');
      return;
    }

    setIsAdding(true);
    try {
      // Save to local database
      const response = await fetch('/api/bourbons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualBourbon),
      });

      if (response.ok) {
        alert(`${manualBourbon.name} has been added to your database!`);
        setManualBourbon({
          name: '',
          distiller: '',
          abv: '',
          region: '',
          category: 'Bourbon',
          price: 'Medium',
          age: 'No age statement',
        });
        setIsManualEntry(false);
      } else {
        alert('Failed to add bourbon. Please try again.');
      }
    } catch (error) {
      console.error('Error adding bourbon:', error);
      alert('Failed to add bourbon. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddBourbon = async () => {
    if (!selectedBourbon) return;

    setIsAdding(true);
    try {
      console.log('Adding bourbon:', selectedBourbon);
      alert(`${selectedBourbon.name} has been added to your collection!`);
      setSelectedBourbon(null);
    } catch (error) {
      console.error('Error adding bourbon:', error);
      alert('Failed to add bourbon. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add to Your Bourbon Collection</h1>
      
      <div className={styles.content}>
        <div className={styles.selectorContainer}>
          <h2 className={styles.sectionTitle}>Select a Bourbon</h2>
          <p className={styles.sectionDescription}>
            Search from your local bourbon database or add a new one manually. Your database will build up as you add items.
          </p>
          
          <BourbonSelector
            onBourbonSelect={handleBourbonSelect}
            selectedBourbon={selectedBourbon}
            placeholder="Search for bourbons, ryes, or Tennessee whiskeys..."
          />

          <div className={styles.manualEntryToggle}>
            <button
              className={styles.toggleButton}
              onClick={() => {
                setIsManualEntry(!isManualEntry);
                setSelectedBourbon(null);
              }}
            >
              {isManualEntry ? 'Cancel Manual Entry' : 'Add New Bourbon Manually'}
            </button>
          </div>
        </div>

        {isManualEntry && (
          <div className={styles.manualEntryContainer}>
            <h2 className={styles.sectionTitle}>Manual Entry</h2>
            <form onSubmit={handleManualSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name*</label>
                <input
                  type="text"
                  className={styles.input}
                  value={manualBourbon.name}
                  onChange={(e) => setManualBourbon({ ...manualBourbon, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Distiller*</label>
                <input
                  type="text"
                  className={styles.input}
                  value={manualBourbon.distiller}
                  onChange={(e) => setManualBourbon({ ...manualBourbon, distiller: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ABV</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={manualBourbon.abv}
                    onChange={(e) => setManualBourbon({ ...manualBourbon, abv: e.target.value })}
                    placeholder="e.g. 45%"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Age</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={manualBourbon.age}
                    onChange={(e) => setManualBourbon({ ...manualBourbon, age: e.target.value })}
                    placeholder="e.g. 10 years"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Region</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={manualBourbon.region}
                    onChange={(e) => setManualBourbon({ ...manualBourbon, region: e.target.value })}
                    placeholder="e.g. Kentucky"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.input}
                    value={manualBourbon.category}
                    onChange={(e) => setManualBourbon({ ...manualBourbon, category: e.target.value })}
                  >
                    <option value="Bourbon">Bourbon</option>
                    <option value="Rye">Rye</option>
                    <option value="Tennessee Whiskey">Tennessee Whiskey</option>
                    <option value="Scotch">Scotch</option>
                    <option value="Irish Whiskey">Irish Whiskey</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price Range</label>
                <select
                  className={styles.input}
                  value={manualBourbon.price}
                  onChange={(e) => setManualBourbon({ ...manualBourbon, price: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className={styles.actionContainer}>
                <button
                  type="submit"
                  className={styles.addButton}
                  disabled={isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add to Database'}
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedBourbon && !isManualEntry && (
          <div className={styles.selectedContainer}>
            <h2 className={styles.sectionTitle}>Selected Bourbon</h2>
            <div className={styles.bourbonCard}>
              <div className={styles.bourbonDetails}>
                <h3 className={styles.bourbonName}>{selectedBourbon.name}</h3>
                <div className={styles.bourbonMeta}>
                  <span className={styles.distiller}>{selectedBourbon.distiller}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.region}>{selectedBourbon.region}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.abv}>{selectedBourbon.abv}</span>
                </div>
                <div className={styles.bourbonInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Category:</span>
                    <span className={styles.infoValue}>{selectedBourbon.category}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Age:</span>
                    <span className={styles.infoValue}>{selectedBourbon.age}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Price Range:</span>
                    <span className={styles.infoValue}>{selectedBourbon.price}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.actionContainer}>
              <button
                className={styles.addButton}
                onClick={handleAddBourbon}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add to Collection'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 