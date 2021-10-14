import React from 'react'
import styled from 'styled-components'
import striptags from 'striptags'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DetailPage from 'components/DetailPage'
import ListItem from 'components/ListItem'
// import TaskGroupItem from 'components/TaskGroupItem'
// import { fetchTaskDetails } from 'api'
// import { actionTypes } from 'components/Actions'

import {
  deepFlatten,
  determineLanguageFromUrl,
  getTermInLanguage,
  // getTaskGroupStatus,
} from 'helpers'
import { ITEM_TYPES } from 'consts'
import { fetchActivity } from 'api'
import { setItemsByGuid } from 'redux/actionCreators'

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
  overflow: scroll;
`

const TaskGroup = () => {
  // const [details, setDetails] = useState()
  const { id } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const userTasks = useSelector((state) => state.tasks)
  // const user = useSelector((state) => state.user)
  const taskGroup = useSelector((state) => state.itemsByGuid[id])
  // const activityTranslations = useSelector(
  //   (state) => state.translations.aktiviteetin_ylakasite
  // )
  const generalTranslations = useSelector((state) => state.translations.yleiset)
  // const favourites = useSelector((state) => state.favourites)

  // const mandatoryTasksGuids =
  //   taskGroup.activities.length > 0 && !taskGroup.activity_groups
  //     ? useSelector(
  //         (state) =>
  //           state.taskGroupRequirements.taskGroupRequirements[id]
  //             .mandatoryTasks
  //       )
  //     : []
  // if (!taskGroup || !activityTranslations) {
  //   return null
  // }

  // const getTranslation = (taskOrTaskGroup) => {
  //   return taskOrTaskGroup.languages.find((x) => x.lang === language)
  // }

  // const getTaskGroupDetails = async () => {
  //   const res = await fetchTaskDetails(taskGroup.item.guid, language)
  //   setDetails(res)
  // }

  // if (!details) {
  //   getTaskGroupDetails()
  // }

  // const { item } = taskGroup
  // console.log('item', item)
  // const taskGroupTranslation = getTranslation(item)

  // const mandatoryTasks = []
  // const optionalTasks = []

  // item.tasks.forEach((task) => {
  //   if (mandatoryTasksGuids.includes(task.guid)) {
  //     mandatoryTasks.push(task)
  //   } else {
  //     optionalTasks.push(task)
  //   }
  // })

  const getTask = (task) => {
    const dispatch = useDispatch()

    fetchActivity(task.wp_guid).then((activity) =>
      dispatch(setItemsByGuid(deepFlatten(activity)))
    )
    // const taskTranslation = getTranslation(task)
    const status = userTasks[task.wp_guid]
      ? userTasks[task.wp_guid].toLowerCase()
      : ''
    const task_status = status === 'active' ? 'started' : `task_${status}`

    return (
      <ListItem
        key={task.id}
        guid={task.wp_guid}
        ageGroupGuid={taskGroup.ageGroupGuid}
        title={task.title}
        subTitle={getTermInLanguage(
          generalTranslations,
          `${task_status}`,
          language
        )}
        language={language}
        itemType={ITEM_TYPES.TASK}
        showActions
        showFavourite
        // isFavourite={favourites.includes(task.guid)}
        isLoggedIn={status}
      />
    )
  }

  return (
    <StyledDetailPage
      onBackClick={() =>
        history.push(
          `/guid/${taskGroup.item.age_group.wp_guid}?lang=${language}`
        )
      }
      // taskGroupTranslation ? taskGroupTranslation.title :
      title={taskGroup.title}
    >
      <TaskList>
        {taskGroup.item.ingress && <p>{striptags(taskGroup.item.ingress)}</p>}
        {taskGroup.item.content && taskGroup.item.content.length < 700 && (
          <p>{striptags(taskGroup.item.content)}</p>
        )}
        {taskGroup.item.activities.length > 0 &&
          taskGroup.item.activities.map((task) => {
            return getTask(task)
          })}
      </TaskList>
    </StyledDetailPage>
  )
}

export default TaskGroup
