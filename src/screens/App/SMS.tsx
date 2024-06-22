import useTheme from 'hooks/useTheme';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MT } from 'styled/MT';
import { Wrapper } from 'styled';
import HeaderBar from 'components/HeaderBar';
import Switcher from 'components/Switcher';
import NewChatFAB from 'components/Buttons/NewChatFAB';
import ThreadCard, { ITEM_COVER_HEIGHT } from 'components/ThreadCard3';
import { FlashList } from '@shopify/flash-list';
import ThreadActionHeader from 'components/ThreadActionHeader';
import CategoryList from 'components/CategoryList';
import MessageBox from 'components/MessageBox';
import ConfirmationDialogue from 'components/ConfirmationDialouge';
import { CommonStyles } from 'styled/common.styles';
import ThreadQueryServices, { ThreadResponse } from 'services/thread-query.services';
import {
  keepPreviousData,
  useInfiniteQuery as useTanStackInfiniteQuery,
} from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { VIEW_ACTIONS, selectViewId } from 'redux/threads';
import TanStackQueryService from 'services/query-services';
import SMSQueryServices from 'services/sms-query.services';
import { convertSMSToGiftedChatData } from 'utils/threads';

import unionBy from 'lodash.unionby';
import { themeColorCombinations } from 'constants/theme';

const SMS = () => {
  const theme = useTheme();
  const viewID = useSelector(selectViewId);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [deleteConfirmDialogue, setDeleteConfirmDialogue] = useState(false);

  const { data, refetch, fetchNextPage, isFetching, isFetchingNextPage } = useTanStackInfiniteQuery({
    queryKey: ['threads', searchOpen, keyword],
    initialPageParam: -1,
    getNextPageParam: lastPage => {
      if (searchOpen && keyword.length < 3) {
        return undefined;
      } else if (lastPage.cursor?.has_next) {
        const next_cursor = Math.max(lastPage?.cursor?.next_cursor, 0) || undefined;
        return next_cursor;
      }
      return undefined;
    },
    getPreviousPageParam: firstPage => firstPage?.cursor?.next_cursor ?? -1,
    queryFn: async ({ pageParam }) => {
      const _cursor = Number.isFinite(pageParam) ? pageParam : -1;
      if (!searchOpen || keyword.length < 3) {
        return await ThreadQueryServices.getThreads(_cursor);
      }
      return await ThreadQueryServices.searchThreadsByKeyword(keyword);
    },
    enabled: true, // Always enabled to handle refetching on keyword change
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const displayedData = useMemo(() => {
    if (!data) {
      return [];
    }

    const _data = data.pages.reduce((acc, page) => {
      return [...acc, ...page.threads];
    }, [] as ThreadResponse[]);

    return unionBy(_data, 'thread_id');
  }, [data]);

  const renderEmptyList = useCallback(() => {
    const message = isFetching ? 'Loading...' : 'No data at the moment !!!';
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ color: 'black', fontSize: 16, fontWeight: '400' }}>
          {message}
        </Text>
      </View>
    );
  }, [isFetching]);

  const renderFooter = useCallback(() => {
    return (
      <View style={styles.footer}>
        {isFetchingNextPage && <ActivityIndicator />}
      </View>
    );
  }, [isFetchingNextPage]);

  useEffect(() => {
    setInterval(() => {
      displayedData.forEach((thread: ThreadResponse) => {
        const threadId = thread?.thread_id;

        if (!threadId) {
          return;
        }

        const key = ['sms-thread-content', threadId];
        const isCached = !!TanStackQueryService.queryClient.getQueryData(key);
        if (isCached) {
          return;
        }

        TanStackQueryService.prefetchInfiniteQuery(
          key,
          async () => {
            const response = await SMSQueryServices.getSMSbyThreadId(threadId, -1);

            return {
              sms: response?.sms.map(convertSMSToGiftedChatData) ?? [],
              cursor: response.cursor,
            };
          },
          -1,
        );
      });
    }, 1000)
  }, [displayedData]);

  const renderItem = useCallback(
    ({ item }: { item: ThreadResponse }) => {
      return <ThreadCard item={item} selected={selected} setSelected={setSelected} />;
    },
    [selected],
  );

  const handleSearch = useCallback(async (text = '') => {
    const trimmedText = text.trim();
    setKeyword(trimmedText);
    setSearchOpen(trimmedText.length > 0);
    refetch();
  }, [refetch]);

  const handleClearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const closeDeleteConfirmationDialogue = useCallback(() => {
    setDeleteConfirmDialogue(false);
  }, []);

  const handlePressCancel = useCallback(() => {
    closeDeleteConfirmationDialogue();
  }, [closeDeleteConfirmationDialogue]);

  const openDeleteConfirmationDialogue = useCallback(() => {
    setDeleteConfirmDialogue(true);
  }, []);

  const handleDelete = useCallback(() => {
    openDeleteConfirmationDialogue();
  }, [openDeleteConfirmationDialogue]);

  const handlePin = useCallback(async () => {
    try {
      setSelected([]);
    } catch (error) {
      // console.log(err, 'ThreadActionHeader/handlePin');
    }
  }, []);

  const handleArchive = useCallback(async () => {
    try {
      setSelected([]);
    } catch (error) {
      // console.log(err, 'ThreadActionHeader/handleArchive');
    }
  }, []);

  const handlePressConfirmDelete = useCallback(async () => {
    try {
      const result = await ThreadQueryServices.deleteThreads(selected);
      if (result) {
        handleClearSelection();
        closeDeleteConfirmationDialogue();
      }
    } catch (err) {
      closeDeleteConfirmationDialogue();
      // console.log(err, 'handleDelete');
    } finally {
      refetch();
    }
  }, [closeDeleteConfirmationDialogue, handleClearSelection, refetch, selected]);

  const keyExtractor = useCallback(
    (item: ThreadResponse) => `sms-thread-${item.thread_id}`,
    [],
  );

  useEffect(() => {
    const action = (viewID ?? '').split('-')[0] ?? '';
    if (action === 'idle') {
      return;
    } else if (VIEW_ACTIONS.includes(action)) {
      refetch();
    }
  }, [refetch, viewID]);

  return (
    <Wrapper backgroundColor={themeColorCombinations.light.background}>
      <>
        <ConfirmationDialogue
          visible={deleteConfirmDialogue}
          title="Delete this conversation?"
          description="This is permanent and can’t be undone"
          onCancelPressed={handlePressCancel}
          onConfirmPressed={handlePressConfirmDelete}
          cancelText="Cancel"
          confirmText="Delete"
        />

        <HeaderBar
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          onSearch={handleSearch}
        />

        <MT MT={theme.spacings.verticalScale.s16} />
        <View style={CommonStyles.flex1}>
          <FlashList
            onEndReached={() => {
              if (searchOpen && keyword.length >= 3) {
                return;
              }
              fetchNextPage();
            }}
            onEndReachedThreshold={0.8}
            keyExtractor={keyExtractor}
            extraData={selected}
            estimatedItemSize={ITEM_COVER_HEIGHT}
            data={displayedData}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyList}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{}}
          />
        </View>
        {!searchOpen && (
          <>
            <NewChatFAB />
            {/* <Switcher /> */}
          </>
        )}
      </>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 140,
    width: '100%',
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default SMS;
