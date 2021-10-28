import { ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import taskGroupGraphics from 'graphics/taskGroups'

export const determineLanguageFromUrl = (url) => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get('lang') || 'fi'
}

export const getAgeGroupTitleWithoutAges = (title) =>
  title.split('(')[0].split(':')[0].trim()

export const getTermInLanguage = (translationGroup, termKey, language) => {
  const translationsInLanguage = translationGroup.find(
    (translation) => translation.lang === language
  )
  if (translationsInLanguage) {
    const item = translationsInLanguage.items.find(
      (item) => item.key === termKey
    )
    if (item && item.value) {
      return item.value
    }
  }
}

export const getItemType = (item) => {
  const { activity_groups, activities } = item
  if (activities) return ITEM_TYPES.TASK_GROUP
  if (activity_groups) return ITEM_TYPES.AGE_GROUP
  return ITEM_TYPES.TASK
}

export const deepFlatten = (items) => {
  const flattener = (items) => {
    const CHILD_GROUPS = ['activities']

    if (!items) {
      return
    }
    const parsedItems = items.map((x) => ({
      id: x.wp_guid,
      item: x,
      type: getItemType(x),
    }))

    return [
      ...parsedItems,
      ...items
        .map((x) =>
          CHILD_GROUPS.map((childrenKey) =>
            flattener(x[childrenKey], x.wp_guid)
          )
        )
        .flat()
        .filter(Boolean),
    ]
  }

  return flattener(items)
    .flat(Infinity)
    .reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
}

export const getTaskGroupStatus = (taskGroup, userTasks, label) => {
  const completedTasks = taskGroup.activities.reduce((taskCount, task) => {
    if (userTasks[task.wp_guid] === 'COMPLETED') {
      taskCount++
    }
    return taskCount
  }, 0)
  return `${label}: ${completedTasks} / ${taskGroup.activities.length}`
}

export const getGroupTasks = (group) => {
  const taskTypes = {
    mandatory: [],
    optional: [],
  }
  const mandatoryTasks = group.activities.filter(
    (activity) => activity.mandatory === true
  )
  taskTypes.mandatory = taskTypes.mandatory.concat(
    mandatoryTasks.map((mandatory) => mandatory.wp_guid)
  )

  if (mandatoryTasks.length !== group.activities.length) {
    taskTypes.optional = taskTypes.optional.concat(
      group.activities
        .filter((activity) => !taskTypes.mandatory.includes(activity.wp_guid))
        .map((activity) => activity.wp_guid)
    )
  }
  return taskTypes
}

export const getAgeGroupTasks = (ageGroup) => {
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  return ageGroup.activity_groups.reduce(
    (acc, curr) => {
      const activityGroup = itemsByGuid[curr.wp_guid]
      const groupTask = getGroupTasks(activityGroup.item)
      acc.mandatory = acc.mandatory.concat(groupTask.mandatory)
      acc.optional = acc.optional.concat(groupTask.optional)
      return acc
    },
    {
      mandatory: [],
      optional: [],
    }
  )
}

export const getAgeGroupStatus = (ageGroup, userTasks) => {
  const ageGroupTasks = getAgeGroupTasks(ageGroup)
  const completedMandatory = ageGroupTasks.mandatory.filter(
    (task) => userTasks[task] === 'COMPLETED'
  )
  const completedOptional = ageGroupTasks.optional.filter(
    (task) => userTasks[task] === 'COMPLETED'
  )

  return {
    mandatory: `${completedMandatory.length} / ${ageGroupTasks.mandatory.length}`,
    optional: `${completedOptional.length} / ${ageGroupTasks.optional.length}`,
  }
}

export const getActivityGroupIcon = (activityGroup) => {
  const icon = activityGroup.logo.formats
    ? activityGroup.logo.formats.thumbnail.url
    : activityGroup.logo.url
    ? activityGroup.logo.url
    : taskGroupGraphics[`Group${activityGroup.wp_guid}`]
  return icon
}

export const getCompletedTaskGroups = (ageGroup, userTasks) => {
  return ageGroup.activity_groups
    .filter((taskGroup) => {
      const mandatory = taskGroup.mandatory_tasks.split(',')
      if (mandatory.length === 0) return false
      return mandatory.every((guid) => userTasks[guid] === 'COMPLETED')
    })
    .map((taskGroup) => taskGroup.guid)
}

export const getAgeGroupCompletion = (ageGroup, userTasks) => {
  const ageGroupTasks = getAgeGroupTasks(ageGroup)
  const completedMandatory = ageGroupTasks.mandatory.filter(
    (task) => userTasks[task] === 'COMPLETED'
  )

  return (
    completedMandatory.length === ageGroupTasks.mandatory.length &&
    completedMandatory.length > 0
  )
}

//TODO: favourites, activeTasks, completedTasks, isFavourite, isActive and isCompleted helpers
