/** 状态（value） */
enum EStatus {
  Fail = 0,
  Success = 1
}
/** 状态（lable） */
export const STATUS_LABEL = {
  [EStatus.Fail]: '失败123456',
  [EStatus.Success]: '成功123456',
}
/** 状态（list） */
export const STATUS = [
  { label: STATUS_LABEL[EStatus.Fail], value: EStatus.Fail },
  { label: STATUS_LABEL[EStatus.Success], value: EStatus.Success },
]

/** 任务状态（value） */
enum ETaskStatus {
  NoComplete = '0',
  Complete = '1'
}
/** 任务状态（lable） */
export const TASK_STATUS_LABEL = {
  [ETaskStatus.NoComplete]: '未完成',
  [ETaskStatus.Complete]: '完成',
}
/** 任务状态（list） */
export const TASK_STATUS = [
  { label: TASK_STATUS_LABEL[ETaskStatus.NoComplete], value: ETaskStatus.NoComplete },
  { label: TASK_STATUS_LABEL[ETaskStatus.Complete], value: ETaskStatus.Complete },
]