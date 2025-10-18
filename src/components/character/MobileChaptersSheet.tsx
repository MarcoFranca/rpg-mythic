import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";


function MobileChaptersSheet(props: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <div className="mx-auto flex max-w-5xl items-center justify-between">
                <div className="text-sm font-medium tracking-tight">Capítulos do Cântico</div>
                <SheetTrigger asChild>
                    <Button size="sm" variant="secondary">
                        <Menu className="mr-2 h-4 w-4" />
                        Capítulos
                    </Button>
                </SheetTrigger>
            </div>

            <SheetContent
                side="left"
                className="w-[88vw] max-w-[360px] p-0 bg-black/80 backdrop-blur-md border-white/10"
            >
                <SheetHeader className="p-4 pb-2">
                    <SheetTitle className="text-white/80 uppercase tracking-[0.2em] text-xs">
                        Capítulos do Cântico
                    </SheetTitle>
                </SheetHeader>

                {/* scroller do menu no mobile */}
                <div className="min-h-0 max-h-[calc(100dvh-110px)] overflow-y-auto">
                    <div className="p-4">{props.children}</div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
