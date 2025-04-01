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
    public partial class parkinGarageEdit : Form
    {
        public parkinGarageEdit()
        {
            InitializeComponent();
            Start();
            button1.Click += backBtn;
            button2.Click += editBtn;

            button3.Click += errorBtn;
            button4.Click += errorBtn;
            button5.Click += errorBtn;
            button6.Click += errorBtn;
        }
        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Parkolóház választó";
            label1.Font = new Font("Arial", 20, FontStyle.Bold);

            button1.Text = "Vissza";
            button2.Text = "Hozzáadás";

            button3.Text = "Parkolóház 1";
            button4.Text = "Parkolóház 2";
            button5.Text = "Parkolóház 3";
            button6.Text = "Parkolóház 4";

            int label1Mid = label1.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            button1.Left = this.Width / 2 - button1.Width - 40;
            button2.Left = this.Width / 2 + 40;

            button3.Left = button1.Left;
            button5.Left = button1.Left;

            button4.Left = button2.Left;
            button6.Left = button2.Left;

            //button2.Left = button1.Width + ;
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
                this.Close();
                Menu menuForm = new Menu();
                menuForm.Show();
                //this.Close();
            }
        }

        public void editBtn(object s, EventArgs e)
        {
            const string message = "Fejlesztés alatt";
            const string caption = "Hiba";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.OK,
                                         MessageBoxIcon.Error);
        }

        public void errorBtn(object s, EventArgs e)
        {
            const string message = "Fejlesztés alatt";
            const string caption = "Hiba";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.OK,
                                         MessageBoxIcon.Error);
        }
    }
}
