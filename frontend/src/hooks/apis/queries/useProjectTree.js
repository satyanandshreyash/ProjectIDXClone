import { useQuery } from "@tanstack/react-query"
import { getProjectTree } from "../../../apis/project"
import { useTreeStructureStore } from "../../../store/treeStructureStore"
import { useEffect } from "react"

export const useProjectTree = (projectId) => {

    const { setTreeStructure } = useTreeStructureStore()

    const { isLoading, isError, data: projectTree, error } = useQuery({
        queryKey: ["projectTree"],
        queryFn: () => getProjectTree({ projectId }),
    })

    useEffect(() => {
        if (projectTree) {
            setTreeStructure(projectTree)
        }
    }, [projectTree, setTreeStructure])

    return { isLoading, isError, projectTree, error }
}