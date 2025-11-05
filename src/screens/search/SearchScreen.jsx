import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius } from '../../config/theme';

// Mock menu items for search
const ALL_ITEMS = [
  { id: 1, name: 'Espresso', category: 'ESPRESSO HOT', price: 250 },
  { id: 2, name: 'Latte', category: 'ESPRESSO HOT', price: 250 },
  { id: 3, name: 'Cappuccino', category: 'ESPRESSO HOT', price: 250 },
  { id: 4, name: 'Spanish Latte', category: 'ESPRESSO HOT', price: 250 },
  { id: 5, name: 'Cold Brew', category: 'COLD BREW', price: 300 },
  { id: 6, name: 'Avocado Toast', category: 'SOURDOUGH TOAST', price: 350 },
  { id: 7, name: 'Red Pepper Hummus Toast', category: 'SOURDOUGH TOAST', price: 250 },
  { id: 8, name: 'Tiramisu', category: 'DESSERTS', price: 350 },
  { id: 9, name: 'Croissant', category: 'PASTRIES', price: 150 },
];

const RECENT_SEARCHES = ['Latte', 'Avocado Toast', 'Cold Brew'];
const POPULAR_SEARCHES = ['Espresso', 'Cappuccino', 'Croissant', 'Tiramisu'];

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = ALL_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectItem = (item) => {
    navigation.navigate('ItemDetail', { item });
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.trim() === '' ? (
          <>
            {/* Recent Searches */}
            {RECENT_SEARCHES.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.chipContainer}>
                  {RECENT_SEARCHES.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.chip}
                      onPress={() => handleQuickSearch(item)}
                    >
                      <Icon name="time-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.chipText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.chipContainer}>
                {POPULAR_SEARCHES.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => handleQuickSearch(item)}
                  >
                    <Icon name="trending-up-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Browse by Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse by Category</Text>
              <View style={styles.categoryList}>
                {['Coffee', 'Food', 'Desserts', 'Marketplace'].map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryItem}
                    onPress={() => navigation.navigate('Menu')}
                  >
                    <View style={styles.categoryIcon}>
                      <Icon
                        name={
                          category === 'Coffee' ? 'cafe' :
                          category === 'Food' ? 'restaurant' :
                          category === 'Desserts' ? 'ice-cream' :
                          'cart'
                        }
                        size={28}
                        color={colors.textPrimary}
                      />
                    </View>
                    <Text style={styles.categoryText}>{category}</Text>
                    <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Search Results
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''}
            </Text>
            {searchResults.length === 0 ? (
              <View style={styles.noResults}>
                <Icon name="search-outline" size={60} color={colors.textTertiary} />
                <Text style={styles.noResultsTitle}>No items found</Text>
                <Text style={styles.noResultsSubtitle}>
                  Try searching with different keywords
                </Text>
              </View>
            ) : (
              searchResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() => handleSelectItem(item)}
                >
                  <View style={styles.resultImage}>
                    <Text style={styles.resultEmoji}>☕</Text>
                  </View>
                  <View style={styles.resultDetails}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultCategory}>{item.category}</Text>
                    <Text style={styles.resultPrice}>₹{item.price}</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  categoryList: {
    gap: spacing.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  resultImage: {
    width: 60,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 28,
  },
  resultDetails: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  resultCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default SearchScreen;
