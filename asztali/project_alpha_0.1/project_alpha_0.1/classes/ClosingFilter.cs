using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1.osztalyok
{
    public class ClosingFilter : IMessageFilter
    {
        const int WM_SYSKEYDOWN = 0x104;

        public bool PreFilterMessage(ref Message m)
        {
            if (m.Msg == WM_SYSKEYDOWN &&
                ((Keys)m.WParam == Keys.F4) &&
                Control.ModifierKeys == Keys.Alt)
            {
                Application.Exit();
                return true;
            }
            return false;
        }
    }
}
