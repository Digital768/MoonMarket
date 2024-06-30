import React, { useEffect, useState } from 'react'

function useSnapshotData({ snapshotData }) {
    const [organizedSnapshotData, setOrganizedSnapshotData] = useState(snapshotData)
    useEffect(() => {

    }, [snapshotData])
    return (
        organizedSnapshotData
    )
}

export default useSnapshotData