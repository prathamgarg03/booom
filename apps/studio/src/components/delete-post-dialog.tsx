import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type DeletePostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postTitle: string;
  isPublished: boolean;
  onConfirm: () => void;
};

export function DeletePostDialog({
  open,
  onOpenChange,
  postTitle,
  isPublished,
  onConfirm,
}: DeletePostDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{postTitle || "Untitled"}”?</AlertDialogTitle>
          <AlertDialogDescription>
            {isPublished
              ? "It will disappear from your public blog and every site that embeds it. This can't be undone."
              : "The draft will be removed for good. This can't be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep post</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Delete post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
