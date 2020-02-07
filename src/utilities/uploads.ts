
export const getUploadPath = () => 'uploads/files';

export const getTargetUploadPath = (orgId?: string, target?: string, externalPath?: string[]) => {
    let des = `${getUploadPath()}/`;
    if (orgId) {
        des += `${orgId}/`;
    }
    if (target) {
        des += `${target}/`;
    }
    if (externalPath && externalPath.length != 0) {
        des += `${externalPath.join('/')}/`;
    }
    const now = new Date();
    const timeStr = `${now.getFullYear()}/${now.getMonth() + 1}`;
    des += `${timeStr}`;
    return des;
}