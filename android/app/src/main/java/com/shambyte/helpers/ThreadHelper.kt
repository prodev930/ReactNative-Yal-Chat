package com.shambyte.helpers

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.CoroutineExceptionHandler

import android.content.ContentResolver
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.ContactsContract
import android.provider.Telephony
import android.util.Log

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

import com.rt2zz.reactnativecontacts.ContactsProvider

import java.util.function.Consumer


fun getDate(contentResolver: ContentResolver, threadId: Long): Long {

    val uri: Uri = Telephony.Sms.CONTENT_URI
    val projection = arrayOf(Telephony.Sms.DATE)
    val selection = "${Telephony.Sms.THREAD_ID} = ?"
    val selectionArgs = arrayOf(threadId.toString())
    val sortOrder =
        "${Telephony.Sms.DATE} DESC LIMIT 1"  // Orders the SMS by date descending and limits to 1

    contentResolver.query(uri, projection, selection, selectionArgs, sortOrder)?.use { cursor ->
        if (cursor.moveToFirst()) {
            val cursorIndex = cursor.getColumnIndex(Telephony.Sms.DATE)
            return cursor.getLong(cursorIndex)
        }
    }
    return 0
}

fun getPhoneNumber(contentResolver: ContentResolver, threadId: Long): String? {
    val uri = Uri.withAppendedPath(Telephony.Sms.Conversations.CONTENT_URI, "$threadId")
    contentResolver.query(uri, null, null, null, null)?.use { cursor ->
        if (cursor.moveToFirst()) {
            val phoneNumberIndex = cursor.getColumnIndex(Telephony.Sms.Conversations.ADDRESS)
            if (phoneNumberIndex > -1) {
                return cursor.getString(phoneNumberIndex)
            }
        }
    }

    return ""
}

fun getContactByPhoneNumber(contentResolver: ContentResolver, phoneNumber: String): WritableArray {
    val contactsProvider = ContactsProvider(contentResolver)
    return contactsProvider.getContactsByPhoneNumber(phoneNumber)
}

fun getThreadSnippetFromThreadId(contentResolver: ContentResolver, threadId: Long): String {
    val uri: Uri = Telephony.Sms.Conversations.CONTENT_URI
    val projection = arrayOf(Telephony.Sms.Conversations.SNIPPET)
    val selection = "${Telephony.Sms.Conversations.THREAD_ID} = ?"
    val selectionArgs = arrayOf(threadId.toString())

    contentResolver.query(uri, projection, selection, selectionArgs, null)?.use { cursor ->
        if (cursor.moveToFirst()) {
            val snippetIndex = cursor.getColumnIndex(Telephony.Sms.Conversations.SNIPPET)
            if (snippetIndex != -1) {
                return cursor.getString(snippetIndex)
            }
        }
    }

    return ""
}

fun getThreadsPagination(contentResolver: ContentResolver, limit: Int, cursorId: Int): WritableMap {
    val uri: Uri = Telephony.Sms.Conversations.CONTENT_URI
    val projection = arrayOf(
        Telephony.Sms.Conversations.THREAD_ID,
        Telephony.Sms.Conversations.SNIPPET,
    )
    val selection = if (cursorId > 0) "${Telephony.Sms.Conversations.THREAD_ID} <= ?" else null
    val selectionArgs = if (cursorId > 0) arrayOf(cursorId.toString()) else null
    val sortOrder = "${Telephony.Sms.Conversations.DATE} DESC LIMIT ${(limit + 1)}"

    var hasNext = false
    var nextCursor: Long = -1
    val threadsArray = Arguments.createArray()
    contentResolver.query(uri, projection, selection, selectionArgs, sortOrder)?.use { cursor ->

        hasNext = cursor.count > limit

        // unique thread ids
        val threadIds = HashSet<Long>()

        while (cursor.position <= limit && cursor.moveToNext()) {

            val threadIdIndex = cursor.getColumnIndex(Telephony.Sms.Conversations.THREAD_ID)
            val threadId = cursor.getLong(threadIdIndex)

            if (threadIds.contains(threadId)) {
                continue
            }

            threadIds.add(threadId)

            val phoneNumber = getPhoneNumber(contentResolver, threadId)
            val contacts = if (phoneNumber != null) getContactByPhoneNumber(
                contentResolver,
                phoneNumber
            ) else Arguments.createArray()
            val contactName: String? = if (contacts.size() > 0) contacts.getMap(0)
                .getString(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME) else phoneNumber
            val snippetIndex = cursor.getColumnIndex(Telephony.Sms.Conversations.SNIPPET)
            val snippet = cursor.getString(snippetIndex)
            val date = getDate(contentResolver, threadId)
            val unreadCount = getUnreadSmsCountInThread(contentResolver, threadId)
            val map = Arguments.createMap()
            map.putDouble("thread_id", threadId.toDouble())
            map.putString("snippet", snippet)
            map.putArray("contacts", contacts)
            map.putDouble("date", date.toDouble())
            map.putString("contactName", contactName)
            map.putString("phoneNumber", phoneNumber)
            map.putInt("unread_count", unreadCount)
            threadsArray.pushMap(map)

            if (hasNext && cursor.position == limit - 1) {
                hasNext = cursor.moveToNext() // try move to next
                if (hasNext) {
                    val nextCursorIndex =
                        cursor.getColumnIndex(Telephony.Sms.Conversations.THREAD_ID)
                    nextCursor = if (nextCursorIndex >= 0) cursor.getLong(nextCursorIndex) else -1
                }
                break
            }
        }
    }

    val cursorMap = Arguments.createMap()
    cursorMap.putBoolean("has_next", hasNext)
    cursorMap.putInt("limit", limit)
    cursorMap.putDouble("next_cursor", nextCursor.toDouble())
    val response = Arguments.createMap()
    response.putMap("cursor", cursorMap)
    response.putArray("threads", threadsArray)

    return response
}

fun getUnreadSmsCountInThread(contentResolver: ContentResolver, threadId: Long): Int {
    val uri: Uri = Telephony.Sms.Inbox.CONTENT_URI
    val projection = arrayOf("count(*) as count")
    val selection = "${Telephony.Sms.THREAD_ID} = ? AND ${Telephony.Sms.READ} = 0"
    val selectionArgs = arrayOf(threadId.toString())

    contentResolver.query(uri, projection, selection, selectionArgs, null)?.use { cursor ->
        if (cursor.moveToFirst()) {
            val countIndex = cursor.getColumnIndex("count")
            return cursor.getInt(countIndex)
        }
    }

    return 0  // Return 0 if no unread messages are found or in case of an error
}

private fun writeAllContentToMap(cursor: Cursor): WritableMap {
    val map = Arguments.createMap()
    for (i in 0 until cursor.columnCount) {
        val columnName = cursor.getColumnName(i)
        val columnValue = cursor.getString(i)
        map.putString(columnName, columnValue)
    }
    return map
}

private fun writeSMSToMap(cursor: Cursor): WritableMap {
    val sms = Arguments.createMap()
    val idIndex = cursor.getColumnIndex(Telephony.Sms._ID)
    val dateIndex = cursor.getColumnIndex(Telephony.Sms.DATE)
    val bodyIndex = cursor.getColumnIndex(Telephony.Sms.BODY)
    val addressIndex = cursor.getColumnIndex(Telephony.Sms.ADDRESS)
    val typeIndex = cursor.getColumnIndex(Telephony.Sms.TYPE)
    val personIndex = cursor.getColumnIndex(Telephony.Sms.PERSON)

    val id = if (idIndex >= 0) cursor.getLong(idIndex) else -1
    val date = if (dateIndex >= 0) cursor.getLong(dateIndex) else 0
    val body = if (bodyIndex >= 0) cursor.getString(bodyIndex) else ""
    val address = if (addressIndex >= 0) cursor.getString(addressIndex) else ""
    val type = if (typeIndex >= 0) cursor.getInt(typeIndex) else -1
    val person = if (personIndex >= 0) cursor.getInt(personIndex) else -1

    sms.putDouble("_id", id.toDouble())
    sms.putDouble("date", date.toDouble())
    sms.putString("body", body)
    sms.putString("address", address)
    sms.putInt("type", type)
    sms.putInt("person", person)

    return sms
}

fun countKeywordOccurrences(text: String, keyword: String): Int {
    val regex = Regex("\\b$keyword\\b", RegexOption.IGNORE_CASE)
    return regex.findAll(text).count()
}

/**
    scoring text based on keyword
    maximum score is 1 and minimum is 0
    if keyword max text in position 0  and end match in end of length then score is 1
 */
fun scoringText(text: String = "", keyword: String = ""): Int {
    val textLength = text.length
    val keywordLength = keyword.length
    if (textLength == 0 || keywordLength == 0) {
        return 0
    }

    val textLower = text.lowercase()
    val keywordLower = keyword.lowercase()

    val start = textLower.indexOf(keywordLower)
    if (start == -1) {
        return 0
    }
    // scoring based on start position
    val indexScore = (textLength - start) / textLength.toDouble()
    // scoring based on total match
    val matchScore = keywordLength / textLength.toDouble() * 0.5

    val repeatScore = countKeywordOccurrences(textLower, keywordLower) * 0.5
    return (indexScore + matchScore + repeatScore).toInt()
}

fun searchThreads(contentResolver: ContentResolver, keyword: String): WritableMap {
    val responseMap = Arguments.createMap()

    // Find contact IDs that match the keyword as name or phone number
    val contactUri = ContactsContract.CommonDataKinds.Phone.CONTENT_URI
    val contactProjection = arrayOf(
        ContactsContract.CommonDataKinds.Phone.NUMBER,
        )
    val contactIdSelection = ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " LIKE ? OR " +
            ContactsContract.CommonDataKinds.Phone.NUMBER + " LIKE ?"
    val contactIdSelectionArgs = arrayOf(
        "%$keyword%",
        "%$keyword%"
    )
    val phoneNumbersSet: MutableSet<String> = HashSet()
    contentResolver.query(
        contactUri,
        contactProjection,
        contactIdSelection,
        contactIdSelectionArgs,
        null
    )?.use { contactCursor ->
        while (contactCursor.moveToNext()) {
            phoneNumbersSet.add(contactCursor.getString(0))
        }
    }

    // Prepare to search for SMSs where thread ID is in the found contact IDs, or matches the phone number or content
    val smsProjection = arrayOf(
        Telephony.Sms.THREAD_ID,
        Telephony.Sms.BODY,
        Telephony.Sms.ADDRESS,
    )
    val phoneNumbersString = if (phoneNumbersSet.isEmpty()) "-1" else phoneNumbersSet.joinToString(",")
    val smsSelection = "(" + Telephony.Sms.ADDRESS + " LIKE ? OR " +
            Telephony.Sms.BODY + " LIKE ? OR " +
            Telephony.Sms.ADDRESS + " IN (" + phoneNumbersString + "))"
    val smsSelectionArgs = arrayOf(
        "%$keyword%",
        "%$keyword%"
    )
    // sort by date desc limit 100000
    val sortOrder = Telephony.Sms.DEFAULT_SORT_ORDER + " LIMIT 100000"

    val threadIdsSet: MutableSet<Long> = HashSet()
    val smsBodyScoringMap = HashMap<String, Int>()
    val smsBodyCountMap = HashMap<String, Int>()
    contentResolver.query(
        Telephony.Sms.CONTENT_URI,
        smsProjection,
        smsSelection,
        smsSelectionArgs,
        sortOrder
    )?.use {
        smsCursor ->
        while (smsCursor.moveToNext()) {
            val threadIdIndex = smsCursor.getColumnIndex(Telephony.Sms.THREAD_ID)
            val bodyIndex = smsCursor.getColumnIndex(Telephony.Sms.BODY)
            val body = smsCursor.getString(bodyIndex)
            val phoneNumberIndex = smsCursor.getColumnIndex(Telephony.Sms.ADDRESS)
            val phoneNumber = smsCursor.getString(phoneNumberIndex)
            if (phoneNumber != null) {
                val scoreBody = scoringText(body ?: "", keyword)
                smsBodyScoringMap[phoneNumber] = scoreBody
                smsBodyCountMap[phoneNumber] = smsBodyCountMap.getOrDefault(phoneNumber, 0) + 1
            }
            val threadId = smsCursor.getLong(threadIdIndex)
            threadIdsSet.add(threadId)
        }
    }

    val newScoreMap = HashMap<String, Int>()

    smsBodyScoringMap.forEach { (phoneNumber, score) ->
        val appearCount = smsBodyCountMap.getOrDefault(phoneNumber, 1)
        val newScore = score / appearCount
        newScoreMap[phoneNumber] = newScore
    }

    val threads = ArrayList<WritableMap>()
    threadIdsSet.forEach(Consumer { threadId: Long ->
        val snippet = getThreadSnippetFromThreadId(contentResolver, threadId)
        val phoneNumber = getPhoneNumber(contentResolver, threadId)
        val contacts = phoneNumber?.let { getContactByPhoneNumber(contentResolver, it) }
            ?: Arguments.createArray()
        val contactName = if (contacts.size() > 0) contacts.getMap(0)
            .getString(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME) else phoneNumber

        val contactScore = scoringText(contactName ?: "", keyword)
        val bodyScore = newScoreMap.getOrDefault(phoneNumber, 0)
        val score = contactScore + bodyScore * 0.5

        val date = getDate(contentResolver, threadId)
        val unreadCount = getUnreadSmsCountInThread(contentResolver, threadId)
        val map = Arguments.createMap()
        map.putDouble("thread_id", threadId.toDouble())
        map.putString("snippet", snippet)
        map.putArray("contacts", contacts)
        map.putDouble("date", date.toDouble())
        map.putString("contactName", contactName)
        map.putString("phoneNumber", phoneNumber)
        map.putInt("unread_count", unreadCount)
        map.putDouble("score", score)
        map.putString("keyword", keyword)
        threads.add(map)
    })

    // sort threads by score DESC
    threads.sortByDescending { it.getDouble("score") }
    // convert threads to WriteableArray
    val threadsArray = Arguments.createArray()
    threads.forEach(Consumer { thread: WritableMap -> threadsArray.pushMap(thread) })

    responseMap.putArray("threads", threadsArray)
    return responseMap
}

fun deleteSmsThreads(context: Context, threadIds: Array<Long>): Int {
    if (!Telephony.Sms.getDefaultSmsPackage(context).equals(context.packageName)) {
        // Check if the app is not the default SMS app
        println("This app is not the default SMS app and cannot delete SMS.")
        return -1
    }

    val uri = Uri.parse("content://sms")
    val contentResolver: ContentResolver = context.contentResolver
    // Prepare the "IN" clause with placeholders for each thread ID
    val inClause = threadIds.joinToString(separator = ",", prefix = "(", postfix = ")") { "?" }
    val where = "${Telephony.Sms.THREAD_ID} IN $inClause"
    val whereArgs = threadIds.map { it.toString() }.toTypedArray()

    return contentResolver.delete(uri, where, whereArgs)
}

fun markSmsAsReadInThread(contentResolver: ContentResolver, threadId: Long): Int {
    val uri: Uri = Telephony.Sms.Inbox.CONTENT_URI
    val values = ContentValues()
    values.put(Telephony.Sms.READ, 1)  // Setting the READ column to 1 marks the SMS as read

    val selection = "${Telephony.Sms.THREAD_ID} = ? AND ${Telephony.Sms.READ} = 0"
    val selectionArgs = arrayOf(threadId.toString())

    return contentResolver.update(uri, values, selection, selectionArgs)
}

fun getThreadIdFromNumber(contentResolver: ContentResolver, phoneNumber: String): Long {
    val projection = arrayOf(Telephony.Sms.THREAD_ID)
    val selection = "${Telephony.Sms.ADDRESS} = ?"
    val selectionArgs = arrayOf(phoneNumber)
    val sortOrder = "date DESC LIMIT 1"
    contentResolver.query(Telephony.Sms.CONTENT_URI, projection, selection, selectionArgs, sortOrder)?.use { cursor ->
        while (cursor.moveToNext()) {
            val threadIdIndex = cursor.getColumnIndex(Telephony.Sms.THREAD_ID)
            if (threadIdIndex != -1) {
                return cursor.getLong(threadIdIndex)
            }
        }
    }
    return -1
}

fun getSMSInAThreadId(
    contentResolver: ContentResolver,
    threadId: Int,
    cursorId: Int,
    limit: Int
): WritableMap {
    val uri = Uri.parse("content://sms/")
    val projection = arrayOf("_id", "address", "date", "body", "person", "type")
    val selection: String
    val selectionArgs: Array<String>
    if (cursorId < 0) {
        // Fetching the first page
        selection = Telephony.Sms.Conversations.THREAD_ID + " = ?"
        selectionArgs = arrayOf(threadId.toString())
    } else {
        // Fetching subsequent pages, starting after the last SMS ID received
        selection =
            Telephony.Sms.Conversations.THREAD_ID + " = ? AND " + Telephony.Sms._ID + " <= ?"
        selectionArgs = arrayOf(threadId.toString(), cursorId.toString())
    }
    val sortOrder = "date DESC LIMIT " + (limit + 1)
    val smsResponse = Arguments.createMap()
    val smsArray = Arguments.createArray()
    var nextCursor = -1L
    var hasNext = false
    contentResolver.query(uri, projection, selection, selectionArgs, sortOrder)?.use { cursor ->
        hasNext = cursor.count > limit
        // Loop through the cursor and read SMS messages
        while (cursor.position <= limit && cursor.moveToNext()) {
            val sms = writeSMSToMap(cursor)

            smsArray.pushMap(sms)

            if (hasNext && cursor.position == limit - 1) {
                hasNext = cursor.moveToNext() // try move to next
                if (hasNext) {
                    val nextCursorIndex = cursor.getColumnIndex("_id")
                    nextCursor = if (nextCursorIndex >= 0) cursor.getLong(nextCursorIndex) else -1
                }
                break
            }
        }
    }
    smsResponse.putArray("sms", smsArray)
    val queryCursor = Arguments.createMap()
    queryCursor.putDouble("next_cursor", nextCursor.toDouble())
    queryCursor.putBoolean("has_next", hasNext)
    queryCursor.putInt("limit", limit)
    smsResponse.putMap("cursor", queryCursor)

    return smsResponse
}


/**
 * async processes exported
 */


fun asyncGetSMSsInAThread(
    contentResolver: ContentResolver,
    promise: Promise,
    threadId: Int,
    cursorId: Int,
    limit: Int
) {
    val errorHandler = CoroutineExceptionHandler { _, exception ->
        Log.e("ThreadHelper", "Error searching Threads: ${exception.localizedMessage}", exception)
        promise.reject(exception)
    }

    CoroutineScope(Dispatchers.IO + errorHandler).launch {
        val result = getSMSInAThreadId(contentResolver, threadId, cursorId, limit)
        promise.resolve(result)
    }
}

fun asyncGetThreadsPagination(
    contentResolver: ContentResolver,
    promise: Promise,
    limit: Int,
    cursorId: Int
) {
    val errorHandler = CoroutineExceptionHandler { _, exception ->
        Log.e(
            "ThreadHelper",
            "Error fetching Threads list: ${exception.localizedMessage}",
            exception
        )
        promise.reject(exception)
    }

    CoroutineScope(Dispatchers.IO + errorHandler).launch {
        val result = getThreadsPagination(contentResolver, limit, cursorId)
        promise.resolve(result)
    }
}

fun asyncSearchThreads(
    contentResolver: ContentResolver,
    promise: Promise,
    keyword: String
) {
    val errorHandler = CoroutineExceptionHandler { _, exception ->
        Log.e("ThreadHelper", "Error searching Threads: ${exception.localizedMessage}", exception)
        promise.reject(exception)
    }

    CoroutineScope(Dispatchers.IO + errorHandler).launch {
        val result = searchThreads(contentResolver, keyword)
        promise.resolve(result)
    }
}

fun asyncGetThreadIdFromNumber(
    contentResolver: ContentResolver,
    promise: Promise,
    phoneNumber: String
) {
    val errorHandler = CoroutineExceptionHandler { _, exception ->
        Log.e("ThreadHelper", "Error fetching Thread Id from Phone Number: ${exception.localizedMessage}", exception)
        promise.reject(exception)
    }

    CoroutineScope(Dispatchers.IO + errorHandler).launch {
        val result = getThreadIdFromNumber(contentResolver, phoneNumber)
        promise.resolve(result.toDouble())
    }
}
