import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography } from '../../config/theme';
import { getMenuForStore, getAllCategories } from '../../data/storeMenus';

const SearchScreen = ({ navigation }) => {
  const selectedStore = useSelector((state) => state.location?.selectedStore);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'Latte',
    'Cold Brew',
    'Croissant',
  ]);

  const CATEGORIES = getAllCategories();

  // Load all menu items from selected store
  useEffect(() => {
    if (selectedStore) {
      const storeMenu = getMenuForStore(selectedStore.id);
      
      const items = [];
      Object.keys(storeMenu).forEach((categoryKey) => {
        const categoryItems = storeMenu[categoryKey] || [];
        const category = CATEGORIES.find((cat) => cat.key === categoryKey);
        
        categoryItems.forEach((item) => {
          items.push({
            ...item,
            categoryKey: categoryKey,
            categoryName: category?.name || categoryKey.toUpperCase(),
          });
        });
      });
      
      setAllMenuItems(items);
    }
  }, [selectedStore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = allMenuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(results);
  };

  const handleSelectItem = (item) => {
    // Add to recent searches
    setRecentSearches((prev) => {
      const updated = [item.name, ...prev.filter((s) => s !== item.name)];
      return updated.slice(0, 5);
    });

    // Navigate to item detail
    navigation.navigate('ItemDetail', { item });
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleSearch('');
  };

  const POPULAR_SEARCHES = [
    'Espresso',
    'Cappuccino',
    'Latte',
    'Cold Brew',
    'Croissant',
    'Tiramisu',
  ];

  const CATEGORY_BROWSE = [
    { 
      name: 'Coffee', 
      icon: 'cafe', 
      description: 'All coffee drinks',
      categories: ['espresso_hot', 'espresso_iced', 'brews']
    },
    { 
      name: 'Food', 
      icon: 'restaurant', 
      description: 'Savory dishes',
      categoryKey: 'savoury' 
    },
    { 
      name: 'Desserts', 
      icon: 'ice-cream', 
      description: 'Sweet treats',
      categoryKey: 'sweet' 
    },
    { 
      name: 'Marketplace', 
      icon: 'cart', 
      description: 'Coffee beans & merchandise',
      navigate: 'Marketplace'
    },
  ];

  const handleCategoryBrowse = (category) => {
    if (category.navigate) {
      // Navigate to specific screen (e.g., Marketplace)
      navigation.navigate(category.navigate);
    } else if (category.categoryKey) {
      // Navigate to Menu and scroll to specific category
      navigation.navigate('Menu', { 
        scrollToCategory: category.categoryKey 
      });
    } else if (category.categories) {
      // Navigate to first category in the group
      navigation.navigate('Menu', { 
        scrollToCategory: category.categories[0] 
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SEARCH</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Icon name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {searchQuery.trim() === '' ? (
          <>
            {/* Store Info */}
            {selectedStore && (
              <View style={styles.storeInfo}>
                <Icon name="location" size={16} color={colors.textSecondary} />
                <Text style={styles.storeText}>
                  {selectedStore.spaceName} - {selectedStore.area}
                </Text>
              </View>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.chipContainer}>
                  {recentSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.chip}
                      onPress={() => handleQuickSearch(item)}
                      activeOpacity={0.7}
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
                    activeOpacity={0.7}
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
                {CATEGORY_BROWSE.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryItem}
                    onPress={() => handleCategoryBrowse(category)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryIcon}>
                      <Icon
                        name={category.icon}
                        size={28}
                        color={colors.textPrimary}
                      />
                    </View>
                    <View style={styles.categoryTextContainer}>
                      <Text style={styles.categoryText}>{category.name}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </View>
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
                  activeOpacity={0.9}
                >
                  <View style={styles.resultImageContainer}>
                    {item.image ? (
                      <Image
                        source={item.image}
                        style={styles.resultImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.resultImagePlaceholder}>
                        <Text style={styles.resultEmoji}>
                          {item.categoryKey?.includes('espresso') || item.categoryKey?.includes('brew') 
                            ? '☕' 
                            : item.categoryKey?.includes('sweet') 
                            ? '🍰' 
                            : '🍽️'}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.resultDetails}>
                    <View style={styles.resultHeader}>
                      {item.isVeg !== undefined && (
                        <View style={styles.vegBadge}>
                          <View 
                            style={[
                              styles.vegDot, 
                              !item.isVeg && { backgroundColor: colors.error }
                            ]} 
                          />
                        </View>
                      )}
                      <Text style={styles.resultName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={styles.resultCategory}>{item.categoryName}</Text>
                    {item.description && (
                      <Text style={styles.resultDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
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
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
  },
  searchBarContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
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
    fontFamily: 'Montserrat-Regular',
  },
  container: {
    flex: 1,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  storeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Montserrat-SemiBold',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
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
    fontFamily: 'Montserrat-Regular',
  },
  categoryList: {
    gap: spacing.sm,
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
  categoryTextContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Montserrat-Regular',
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
    fontFamily: 'Montserrat-Bold',
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.accentCream,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 32,
  },
  resultDetails: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  vegBadge: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  resultName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Montserrat-SemiBold',
  },
  resultCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: 'Montserrat-Regular',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 18,
  },
  resultPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Montserrat-SemiBold',
  },
  bottomSpacing: {
    height: spacing.xxxl * 2,
  },
});

export default SearchScreen;
