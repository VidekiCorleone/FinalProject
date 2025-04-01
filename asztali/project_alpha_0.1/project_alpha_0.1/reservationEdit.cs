using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class reservationEdit : Form
    {
        public reservationEdit()
        {
            InitializeComponent();
            Start();
            button1.Click += backBtn;
            button2.Click += deleteBtn;
            button3.Click += modifyBtn;
            button4.Click += addBtn;
        }
        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Foglalások kezelése";
            button1.Text = "Vissza";
            button2.Text = "Törlés";
            button3.Text = "Módosítás";
            button4.Text = "Hozzáadás";

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;
            int button2Mid = button2.Width / 2;
            int button3Mid = button3.Width / 2;
            int button4Mid = button4.Width / 2;
            int panel1Mid = panel1.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            panel1.Left = this.Width / 2 - panel1Mid;
            button1.Left = panel1.Left;
            button2.Left = button1.Left + button1.Width + 6;
            button3.Left = button2.Left + button2.Width + 6;
            button4.Left = button3.Left + button3.Width + 6;
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Hide();
                Menu menuForm = new Menu();
                menuForm.ShowDialog();
                //this.Close();
            }
        }

        public void deleteBtn(object s, EventArgs e)
        {
            const string message = "Fejlesztés alatt";
            const string caption = "Hiba";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.OK,
                                         MessageBoxIcon.Error);
        }

        public void modifyBtn(object s, EventArgs e)
        {
            //const string message = "Fejlesztés alatt";
            //const string caption = "Hiba";
            //var result = MessageBox.Show(message, caption,
            //                             MessageBoxButtons.OK,
            //                             MessageBoxIcon.Error);

            this.Hide();
            reservationEditEdit reservationEditEditForm = new reservationEditEdit();
            reservationEditEditForm.Show();
        }

        public void addBtn(object s, EventArgs e)
        {
            //const string message = "Fejlesztés alatt";
            //const string caption = "Hiba";
            //var result = MessageBox.Show(message, caption,
            //                             MessageBoxButtons.OK,
            //                             MessageBoxIcon.Error);

            this.Hide();
            reservationEditAdd reservationEditAddForm = new reservationEditAdd();
            reservationEditAddForm.Show();
        }
    }
}
