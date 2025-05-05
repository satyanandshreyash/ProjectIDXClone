import { useMutation } from "@tanstack/react-query"
import { createProjectAPI } from "../../../apis/project"

export const useCreateProject = () => {
    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: createProjectAPI,
        onSuccess: (data) => {
            console.log('Project created successfully!', data);
        },
        onError: (error) => {
            console.log('Error creating project:', error);
        },
    })
    return { createProjectMutation: mutateAsync, isPending, isSuccess, error };
}